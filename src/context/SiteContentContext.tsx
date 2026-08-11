import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface SiteContentValue {
  content: Record<string, string>;
  loading: boolean;
  save: (key: string, value: string) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentValue | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .then(({ data, error }) => {
        if (!error && data) {
          const map: Record<string, string> = {};
          for (const row of data) map[row.key] = row.value;
          setContent(map);
        }
        setLoading(false);
      });
  }, []);

  const save = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) throw new Error('تعذر حفظ التعديل: ' + error.message);
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SiteContentContext.Provider value={{ content, loading, save }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent لازم يتستخدم جوه SiteContentProvider');
  return ctx;
}
