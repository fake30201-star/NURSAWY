import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Accepts either a storage path ("<patient_id>/123.jpg", new orders)
 * or an old public URL (".../object/public/prescriptions/<path>", old orders)
 * and returns the storage path inside the "prescriptions" bucket.
 */
export function toPrescriptionPath(value: string): string | null {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return value;
  const m = value.match(/\/prescriptions\/(.+?)(?:\?.*)?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

interface Props {
  value: string; // order.prescription_url
  label: string;
  className?: string;
}

/**
 * Shows the prescription INSIDE the page (modal) using a short-lived signed URL.
 * No new tab / popup / page navigation, so it also works in the installed PWA
 * and mobile in-app browsers.
 */
export const PrescriptionLink: React.FC<Props> = ({ value, label, className }) => {
  const [busy, setBusy] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const show = async () => {
    const path = toPrescriptionPath(value);
    setErrorMsg(null);
    setSignedUrl(null);
    setOpen(true);
    if (!path) {
      setErrorMsg('تعذر قراءة مسار صورة الروشتة.');
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.storage.from('prescriptions').createSignedUrl(path, 300);
      if (error || !data?.signedUrl) throw error || new Error('no url');
      setSignedUrl(data.signedUrl);
    } catch (e: any) {
      console.error('signed url failed', e);
      setErrorMsg('تعذر فتح صورة الروشتة (' + (e?.message || 'خطأ غير معروف') + ').');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={show} className={className}>
        {label}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-full max-w-full overflow-auto rounded-2xl bg-slate-900 p-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {busy && <p className="p-6 text-sm text-slate-300">جاري التحميل...</p>}
            {errorMsg && <p className="p-6 text-sm text-red-300">{errorMsg}</p>}
            {signedUrl && (
              <img
                src={signedUrl}
                alt="الروشتة"
                className="mx-auto max-h-[80vh] max-w-full object-contain"
                onError={() => setErrorMsg('الملف مش صورة أو تعذر عرضه.')}
              />
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-xl bg-slate-700 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
