import React, { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Send,
  Loader2,
  Store,
  Phone,
  Star,
  MessageCircle,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  XCircle,
  Paperclip,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { PharmacyMap, MapMarker } from './PharmacyMap';
import { PharmacyProfile, PharmacyOrder, PharmacyMessage, PharmacyOrderStatus } from '../types';

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 }; // القاهرة كموقع افتراضي لحين إذن الموقع

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const STATUS_LABEL: Record<PharmacyOrderStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: { label: 'بانتظار رد الصيدلية', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30', icon: <Clock className="w-3.5 h-3.5" /> },
  priced: { label: 'تم تحديد السعر — بانتظار موافقتك', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: <Package className="w-3.5 h-3.5" /> },
  confirmed: { label: 'تم التأكيد — جارِ التجهيز', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  preparing: { label: 'جارِ تجهيز الأوردر', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: <Package className="w-3.5 h-3.5" /> },
  out_for_delivery: { label: 'المندوب في الطريق إليك', cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { label: 'تم التسليم', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: 'ملغي', cls: 'bg-red-500/15 text-red-300 border-red-500/30', icon: <XCircle className="w-3.5 h-3.5" /> },
  rejected: { label: 'الصيدلية اعتذرت عن توفير الطلب', cls: 'bg-red-500/15 text-red-300 border-red-500/30', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export const PharmacySection: React.FC = () => {
  const { user } = useAuth();
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);
  const [pharmacies, setPharmacies] = useState<PharmacyProfile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [requestText, setRequestText] = useState('');
  const [addressNote, setAddressNote] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [myOrders, setMyOrders] = useState<PharmacyOrder[]>([]);

  // 1) تحديد موقع المريض
  const detectMyLocation = () => {
    setLocating(true);
    setLocationError(null);
    setUsingDefaultLocation(false);

    if (!window.isSecureContext) {
      setLocationError('تحديد الموقع بيحتاج اتصال آمن (https). افتح الموقع من الرابط الرسمي بتاعه.');
      setMyLocation(DEFAULT_CENTER);
      setUsingDefaultLocation(true);
      setLocating(false);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('المتصفح ده مش بيدعم تحديد الموقع.');
      setMyLocation(DEFAULT_CENTER);
      setUsingDefaultLocation(true);
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        let msg = 'تعذر تحديد موقعك. حاول تاني.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'تم رفض إذن الموقع. من فضلك فعّل صلاحية الموقع لهذا الموقع من إعدادات المتصفح ثم حاول تاني.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'استغرق تحديد الموقع وقت طويل. تأكد إن خدمة الموقع (GPS) شغالة على جهازك وحاول تاني.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'تعذر الوصول لموقعك الحالي. تأكد إن خدمة الموقع مفعّلة على جهازك.';
        }
        setLocationError(msg);
        setMyLocation(DEFAULT_CENTER);
        setUsingDefaultLocation(true);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    detectMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) جلب الصيدليات المسجلة
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, pharmacy_name, pharmacy_phone, pharmacy_address, pharmacy_lat, pharmacy_lng')
        .eq('role', 'pharmacy')
        .not('pharmacy_lat', 'is', null);
      if (!error && data) {
        setPharmacies(data as PharmacyProfile[]);
      }
    })();
  }, []);

  // 3) جلب أوردراتي ومتابعتها Realtime
  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      const { data } = await supabase
        .from('pharmacy_orders')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setMyOrders(data as PharmacyOrder[]);
    };
    loadOrders();

    const channel = supabase
      .channel(`patient_orders_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pharmacy_orders', filter: `patient_id=eq.${user.id}` },
        () => loadOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const pharmaciesWithDistance = useMemo(() => {
    if (!myLocation) return [];
    return pharmacies
      .map((p) => ({
        ...p,
        distanceKm: p.pharmacy_lat && p.pharmacy_lng ? haversineKm(myLocation.lat, myLocation.lng, p.pharmacy_lat, p.pharmacy_lng) : 999,
      }))
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }, [pharmacies, myLocation]);

  const mapMarkers: MapMarker[] = pharmaciesWithDistance.map((p) => ({
    id: p.id,
    lat: p.pharmacy_lat!,
    lng: p.pharmacy_lng!,
    label: p.pharmacy_name || 'صيدلية',
    color: selected.has(p.id) ? 'emerald' : 'purple',
    onClick: () => toggleSelect(p.id),
  }));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = async () => {
    if (!user || !myLocation) return;
    if (selected.size === 0) {
      setSendError('اختر صيدلية واحدة على الأقل من القائمة أو الخريطة');
      return;
    }
    if (!requestText.trim() && !prescriptionFile) {
      setSendError('اكتب اسم الدواء المطلوب أو ارفع صورة الروشتة');
      return;
    }
    setSending(true);
    setSendError(null);
    setSendSuccess(null);
    try {
      let prescriptionUrl: string | null = null;
      if (prescriptionFile) {
        const fileExt = prescriptionFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(filePath, prescriptionFile);
        if (uploadError) throw new Error('تعذر رفع صورة الروشتة: ' + uploadError.message);
        const { data: urlData } = supabase.storage.from('prescriptions').getPublicUrl(filePath);
        prescriptionUrl = urlData.publicUrl;
      }

      const rows = Array.from(selected).map((pharmacyId) => ({
        patient_id: user.id,
        pharmacy_id: pharmacyId,
        request_text: requestText.trim() || null,
        prescription_url: prescriptionUrl,
        status: 'pending' as PharmacyOrderStatus,
        patient_lat: myLocation.lat,
        patient_lng: myLocation.lng,
        patient_address: addressNote.trim() || null,
      }));

      const { error } = await supabase.from('pharmacy_orders').insert(rows);
      if (error) throw new Error(error.message);

      setSendSuccess(`تم إرسال طلبك لـ ${rows.length} صيدلية بنجاح. تابع الردود تحت.`);
      setRequestText('');
      setPrescriptionFile(null);
      setSelected(new Set());
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'حصل خطأ أثناء إرسال الطلب');
    } finally {
      setSending(false);
    }
  };

  const handleApprove = async (order: PharmacyOrder) => {
    await supabase.from('pharmacy_orders').update({ status: 'confirmed', updated_at: new Date().toISOString() }).eq('id', order.id);
  };

  const handleCancel = async (order: PharmacyOrder) => {
    await supabase.from('pharmacy_orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', order.id);
  };

  return (
    <div className="space-y-6 dir-rtl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">اطلب أدويتك من أقرب صيدلية</h2>
            <p className="text-xs sm:text-sm text-slate-400">حدد الصيدليات القريبة، ابعت طلبك أو صورة الروشتة، وقارن الأسعار قبل ما توافق.</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-4 sm:p-6 space-y-4">
        {locationError && (
          <div className="flex items-center justify-between gap-3 flex-wrap bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-300 font-bold">
              {locationError} {usingDefaultLocation && '(بنعرض حاليًا صيدليات حوالين القاهرة كموقع مبدئي)'}
            </p>
            <button
              onClick={detectMyLocation}
              className="shrink-0 text-xs font-bold bg-amber-600 text-white rounded-lg px-3 py-1.5 cursor-pointer"
            >
              حاول تحديد موقعي تاني
            </button>
          </div>
        )}
        {locating ? (
          <div className="h-72 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            جارِ تحديد موقعك...
          </div>
        ) : myLocation ? (
          <PharmacyMap centerLat={myLocation.lat} centerLng={myLocation.lng} markers={mapMarkers} />
        ) : null}

        {/* Pharmacy list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pharmaciesWithDistance.length === 0 && (
            <p className="text-xs text-slate-500 col-span-full text-center py-4">
              لا توجد صيدليات مسجلة بموقع محدد قريب منك بعد.
            </p>
          )}
          {pharmaciesWithDistance.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              className={`text-right p-4 rounded-2xl border transition-all cursor-pointer ${
                selected.has(p.id)
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : 'bg-slate-950 border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-extrabold text-white text-sm">{p.pharmacy_name || 'صيدلية'}</h4>
                {selected.has(p.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {p.pharmacy_address || '—'}
              </p>
              {typeof p.distanceKm === 'number' && (
                <p className="text-[11px] text-emerald-300 mt-1 font-bold">{p.distanceKm.toFixed(1)} كم تقريبًا</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Request form */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-3xl p-6 space-y-4">
        <h3 className="font-extrabold text-white text-sm">تفاصيل الطلب</h3>
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          rows={3}
          placeholder="اكتب اسم الدواء المطلوب والكمية..."
          className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 p-3 text-sm focus:outline-none focus:border-purple-500/60"
        />
        <input
          type="text"
          value={addressNote}
          onChange={(e) => setAddressNote(e.target.value)}
          placeholder="أقرب علامة مميزة لموقعك (اختياري)"
          className="w-full rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 p-3 text-sm focus:outline-none focus:border-purple-500/60"
        />
        <label className="flex items-center gap-2 text-xs font-bold text-cyan-300 border border-cyan-500/30 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-cyan-500/10 transition-all w-fit">
          <Paperclip className="w-4 h-4" />
          {prescriptionFile ? prescriptionFile.name : 'رفع صورة الروشتة (اختياري)'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
          />
        </label>

        {sendError && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{sendError}</p>}
        {sendSuccess && <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">{sendSuccess}</p>}

        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold py-3 text-sm cursor-pointer disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'جارِ الإرسال...' : `إرسال الطلب لـ ${selected.size || 0} صيدلية محددة`}
        </button>
      </div>

      {/* My orders */}
      {myOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-white text-base px-1">طلباتي</h3>
          {myOrders.map((order) => (
            <PatientOrderCard key={order.id} order={order} pharmacies={pharmacies} onApprove={handleApprove} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

const PatientOrderCard: React.FC<{
  order: PharmacyOrder;
  pharmacies: PharmacyProfile[];
  onApprove: (o: PharmacyOrder) => void;
  onCancel: (o: PharmacyOrder) => void;
}> = ({ order, pharmacies, onApprove, onCancel }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [ratingDone, setRatingDone] = useState(false);
  const pharmacy = pharmacies.find((p) => p.id === order.pharmacy_id);
  const status = STATUS_LABEL[order.status];

  useEffect(() => {
    if (order.status !== 'delivered') return;
    supabase
      .from('pharmacy_ratings')
      .select('id')
      .eq('order_id', order.id)
      .maybeSingle()
      .then(({ data }) => setRatingDone(!!data));
  }, [order.id, order.status]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-400" />
          {pharmacy?.pharmacy_name || 'صيدلية'}
        </h4>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.cls}`}>
          {status.icon}
          {status.label}
        </span>
      </div>

      {order.request_text && <p className="text-xs text-slate-300">{order.request_text}</p>}
      {order.prescription_url && (
        <a href={order.prescription_url} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-300 underline">
          عرض صورة الروشتة المرفوعة
        </a>
      )}

      {order.price != null && (
        <div className="flex items-center justify-between bg-slate-950 rounded-xl px-4 py-3 border border-amber-500/20">
          <span className="text-xs text-slate-300">السعر المحدد من الصيدلية</span>
          <span className="text-lg font-black text-amber-300">{order.price} جنيه</span>
        </div>
      )}

      {order.status === 'priced' && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(order)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white font-bold py-2 text-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            موافقة وتأكيد الطلب
          </button>
          <button
            onClick={() => onCancel(order)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 border border-red-500/30 text-red-300 font-bold py-2 text-xs cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            رفض
          </button>
        </div>
      )}

      {(order.status === 'out_for_delivery' || order.status === 'preparing' || order.status === 'confirmed') && order.rep_name && (
        <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/25 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-purple-200">
            <Truck className="w-4 h-4 text-purple-300" />
            المندوب: {order.rep_name}
          </div>
          {order.rep_phone && (
            <a href={`tel:${order.rep_phone}`} className="flex items-center gap-1 text-xs font-bold text-cyan-300">
              <Phone className="w-3.5 h-3.5" />
              اتصال
            </a>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setChatOpen((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-cyan-300 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {chatOpen ? 'إخفاء المحادثة' : 'استشارة سريعة مع الصيدلي'}
        </button>
      </div>
      {chatOpen && <OrderChat orderId={order.id} senderRole="patient" />}

      {order.status === 'delivered' && !ratingDone && (
        <RatingBox
          orderId={order.id}
          pharmacyId={order.pharmacy_id}
          onSubmitted={() => setRatingDone(true)}
        />
      )}
      {order.status === 'delivered' && ratingDone && (
        <p className="text-[11px] text-emerald-400 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-emerald-400" /> شكرًا لتقييمك!
        </p>
      )}
    </div>
  );
};

export const OrderChat: React.FC<{ orderId: string; senderRole: 'patient' | 'pharmacy' }> = ({ orderId, senderRole }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<PharmacyMessage[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('pharmacy_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as PharmacyMessage[]);
    };
    load();

    const channel = supabase
      .channel(`order_chat_${orderId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pharmacy_messages', filter: `order_id=eq.${orderId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new as PharmacyMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const send = async () => {
    if (!text.trim() || !user) return;
    const content = text.trim();
    setText('');
    await supabase.from('pharmacy_messages').insert({
      order_id: orderId,
      sender_id: user.id,
      sender_role: senderRole,
      message: content,
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
        {messages.length === 0 && <p className="text-[11px] text-slate-500 text-center py-2">ابدأ المحادثة...</p>}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-xs px-3 py-1.5 rounded-xl w-fit max-w-[85%] ${
              m.sender_role === senderRole ? 'bg-emerald-600/30 text-emerald-100 mr-auto' : 'bg-slate-800 text-slate-200 ml-auto'
            }`}
          >
            {m.message}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="اكتب رسالتك..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-emerald-500/60"
        />
        <button onClick={send} className="p-2 rounded-lg bg-emerald-600 text-white cursor-pointer">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const RatingBox: React.FC<{ orderId: string; pharmacyId: string; onSubmitted: () => void }> = ({ orderId, pharmacyId, onSubmitted }) => {
  const { user } = useAuth();
  const [stars, setStars] = useState(5);
  const [repStars, setRepStars] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    await supabase.from('pharmacy_ratings').insert({
      order_id: orderId,
      pharmacy_id: pharmacyId,
      patient_id: user.id,
      pharmacy_stars: stars,
      rep_stars: repStars,
      comment: comment.trim() || null,
    });
    setSubmitting(false);
    onSubmitted();
  };

  return (
    <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-amber-300">قيّم تجربتك مع الصيدلية والمندوب</p>
      <StarPicker label="تقييم الصيدلية" value={stars} onChange={setStars} />
      <StarPicker label="تقييم المندوب" value={repStars} onChange={setRepStars} />
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="ملاحظة سريعة (اختياري)"
        className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-amber-500/60"
      />
      <button
        onClick={submit}
        disabled={submitting}
        className="w-full rounded-lg bg-amber-600 text-white font-bold py-2 text-xs cursor-pointer disabled:opacity-50"
      >
        {submitting ? 'جارِ الإرسال...' : 'إرسال التقييم'}
      </button>
    </div>
  );
};

const StarPicker: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-[11px] text-slate-400">{label}</span>
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className="cursor-pointer">
          <Star className={`w-4 h-4 ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
        </button>
      ))}
    </div>
  </div>
);
