import React, { useEffect, useState } from 'react';
import {
  Store,
  Package,
  UserPlus,
  Truck,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Star,
  Users,
  Phone,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { OrderChat } from './PharmacySection';
import { PharmacyOrder, PharmacyOrderStatus, PharmacyRep, PharmacyRating } from '../types';

const STATUS_STEPS: PharmacyOrderStatus[] = ['pending', 'priced', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const STATUS_LABEL: Record<PharmacyOrderStatus, string> = {
  pending: 'طلب جديد',
  priced: 'بانتظار موافقة المريض',
  confirmed: 'تم التأكيد',
  preparing: 'جارِ التجهيز',
  out_for_delivery: 'في الطريق للمريض',
  delivered: 'تم التسليم',
  cancelled: 'ملغي من المريض',
  rejected: 'مرفوض',
};

export const PharmacyDashboard: React.FC = () => {
  const { user, pharmacyName, pharmacyAddress, pharmacyPhone } = useAuth();
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [reps, setReps] = useState<PharmacyRep[]>([]);
  const [ratings, setRatings] = useState<PharmacyRating[]>([]);
  const [tab, setTab] = useState<'orders' | 'reps' | 'ratings'>('orders');
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      const { data } = await supabase
        .from('pharmacy_orders')
        .select('*')
        .eq('pharmacy_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setOrders(data as PharmacyOrder[]);
    };
    const loadReps = async () => {
      const { data } = await supabase.from('pharmacy_reps').select('*').eq('pharmacy_id', user.id).order('created_at', { ascending: false });
      if (data) setReps(data as PharmacyRep[]);
    };
    const loadRatings = async () => {
      const { data } = await supabase.from('pharmacy_ratings').select('*').eq('pharmacy_id', user.id).order('created_at', { ascending: false });
      if (data) setRatings(data as PharmacyRating[]);
    };

    loadOrders();
    loadReps();
    loadRatings();

    const channel = supabase
      .channel(`pharmacy_orders_${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pharmacy_orders', filter: `pharmacy_id=eq.${user.id}` }, () => loadOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateOrder = async (id: string, fields: Partial<PharmacyOrder>) => {
    await supabase.from('pharmacy_orders').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id);
  };

  const deleteOrder = async (id: string) => {
    await supabase.from('pharmacy_orders').delete().eq('id', id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const addRep = async () => {
    if (!user || !repName.trim() || !repPhone.trim()) return;
    const { data } = await supabase
      .from('pharmacy_reps')
      .insert({ pharmacy_id: user.id, full_name: repName.trim(), phone: repPhone.trim() })
      .select()
      .maybeSingle();
    if (data) setReps((prev) => [data as PharmacyRep, ...prev]);
    setRepName('');
    setRepPhone('');
  };

  const removeRep = async (id: string) => {
    await supabase.from('pharmacy_reps').delete().eq('id', id);
    setReps((prev) => prev.filter((r) => r.id !== id));
  };

  const avgPharmacyStars = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.pharmacy_stars, 0) / ratings.length).toFixed(1)
    : '—';

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
            <h2 className="text-xl sm:text-2xl font-black text-white">{pharmacyName || 'لوحة تحكم الصيدلية'}</h2>
            <p className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              {pharmacyAddress && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pharmacyAddress}</span>
              )}
              {pharmacyPhone && (
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {pharmacyPhone}</span>
              )}
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {avgPharmacyStars} ({ratings.length} تقييم)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-emerald-500/20 w-fit">
        {[
          { id: 'orders', label: 'الأوردرات', icon: <Package className="w-3.5 h-3.5" /> },
          { id: 'reps', label: 'المناديب', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'ratings', label: 'التقييمات', icon: <Star className="w-3.5 h-3.5" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === t.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 && <p className="text-sm text-slate-500 text-center py-10">لا توجد أوردرات حتى الآن.</p>}
          {orders.map((order) => (
            <PharmacyOrderCard key={order.id} order={order} reps={reps} onUpdate={updateOrder} onDelete={deleteOrder} />
          ))}
        </div>
      )}

      {/* Reps */}
      {tab === 'reps' && (
        <div className="bg-slate-900 border border-purple-500/20 rounded-3xl p-6 space-y-5">
          <h3 className="font-extrabold text-white text-sm">إدارة المناديب</h3>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="text"
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              placeholder="اسم المندوب"
              className="flex-1 rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500/60"
            />
            <input
              type="tel"
              value={repPhone}
              onChange={(e) => setRepPhone(e.target.value)}
              placeholder="رقم التليفون"
              dir="ltr"
              className="flex-1 rounded-xl bg-slate-950 border border-purple-500/20 text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500/60 text-left"
            />
            <button
              onClick={addRep}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              إضافة
            </button>
          </div>

          <div className="space-y-2">
            {reps.length === 0 && <p className="text-xs text-slate-500 text-center py-4">لسه معملتش مندوبين.</p>}
            {reps.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
                <div>
                  <p className="text-sm font-bold text-white">{r.full_name}</p>
                  <p className="text-xs text-slate-400" dir="ltr">{r.phone}</p>
                </div>
                <button onClick={() => removeRep(r.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ratings */}
      {tab === 'ratings' && (
        <div className="space-y-3">
          {ratings.length === 0 && <p className="text-sm text-slate-500 text-center py-10">لا توجد تقييمات بعد.</p>}
          {ratings.map((r) => (
            <div key={r.id} className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> الصيدلية: {r.pharmacy_stars}/5
                </span>
                {r.rep_stars != null && (
                  <span className="flex items-center gap-1 text-xs font-bold text-purple-300">
                    <Star className="w-3.5 h-3.5 fill-purple-400" /> المندوب: {r.rep_stars}/5
                  </span>
                )}
              </div>
              {r.comment && <p className="text-xs text-slate-300">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PharmacyOrderCard: React.FC<{
  order: PharmacyOrder;
  reps: PharmacyRep[];
  onUpdate: (id: string, fields: Partial<PharmacyOrder>) => void;
  onDelete: (id: string) => void;
}> = ({ order, reps, onUpdate, onDelete }) => {
  const [price, setPrice] = useState(order.price?.toString() || '');
  const [chatOpen, setChatOpen] = useState(false);

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-slate-500">طلب #{order.id.slice(0, 8)}</span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {(order.status === 'delivered' || order.status === 'cancelled' || order.status === 'rejected') && (
        <button
          onClick={() => {
            if (confirm('تأكيد حذف الطلب ده نهائيًا؟')) onDelete(order.id);
          }}
          className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-300 cursor-pointer"
        >
          <XCircle className="w-3 h-3" />
          حذف الطلب
        </button>
      )}

      {order.request_text && <p className="text-sm text-slate-200">{order.request_text}</p>}
      {order.prescription_url && (
        <a href={order.prescription_url} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-300 underline">
          عرض صورة الروشتة
        </a>
      )}
      {order.patient_address && (
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {order.patient_address}
        </p>
      )}

      {/* Pending: set price or reject */}
      {order.status === 'pending' && (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="السعر الإجمالي (جنيه)"
            className="flex-1 rounded-xl bg-slate-950 border border-amber-500/20 text-slate-100 px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60"
          />
          <button
            onClick={() => price && onUpdate(order.id, { status: 'priced', price: Number(price) })}
            disabled={!price}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            إرسال السعر
          </button>
          <button
            onClick={() => onUpdate(order.id, { status: 'rejected' })}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-red-500/30 text-red-300 font-bold text-xs cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            اعتذار
          </button>
        </div>
      )}

      {/* Confirmed: move to preparing */}
      {order.status === 'confirmed' && (
        <button
          onClick={() => onUpdate(order.id, { status: 'preparing' })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs cursor-pointer w-fit"
        >
          <Package className="w-4 h-4" />
          بدء تجهيز الأوردر
        </button>
      )}

      {/* Preparing: assign rep */}
      {order.status === 'preparing' && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-purple-300">إسناد التوصيل لمندوب</p>
          {reps.length === 0 ? (
            <p className="text-xs text-slate-500">أضف مندوبين من تبويب "المناديب" أولًا.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {reps.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onUpdate(order.id, { status: 'out_for_delivery', rep_id: r.id, rep_name: r.full_name, rep_phone: r.phone })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-200 text-xs font-bold cursor-pointer hover:bg-purple-600/30"
                >
                  <Truck className="w-3.5 h-3.5" />
                  {r.full_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Out for delivery: بانتظار تأكيد المريض للاستلام */}
      {order.status === 'out_for_delivery' && (
        <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/25 rounded-xl px-4 py-3">
          <span className="text-xs text-purple-200">المندوب: {order.rep_name}</span>
          <span className="text-[11px] font-bold text-slate-400">بانتظار تأكيد المريض للاستلام...</span>
        </div>
      )}

      <button
        onClick={() => setChatOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-cyan-300 cursor-pointer"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {chatOpen ? 'إخفاء المحادثة' : 'محادثة مع المريض'}
      </button>
      {chatOpen && <OrderChat orderId={order.id} senderRole="pharmacy" />}
    </div>
  );
};
