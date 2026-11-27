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

/** Opens a short-lived (5 min) signed link. Nothing is public. */
export const PrescriptionLink: React.FC<Props> = ({ value, label, className }) => {
  const [busy, setBusy] = useState(false);

  const open = async () => {
    const path = toPrescriptionPath(value);
    if (!path) {
      alert('تعذر قراءة مسار صورة الروشتة.');
      return;
    }
    // Open the tab synchronously so mobile browsers don't block the popup.
    const win = window.open('', '_blank');
    setBusy(true);
    try {
      const { data, error } = await supabase.storage.from('prescriptions').createSignedUrl(path, 300);
      if (error || !data?.signedUrl) throw error || new Error('no url');
      if (win) {
        win.opener = null;
        win.location.href = data.signedUrl;
      } else {
        window.location.href = data.signedUrl;
      }
    } catch (e) {
      win?.close();
      console.error('signed url failed', e);
      alert('تعذر فتح صورة الروشتة. قد لا تملك صلاحية عرضها.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={open} disabled={busy} className={className}>
      {busy ? '...' : label}
    </button>
  );
};
