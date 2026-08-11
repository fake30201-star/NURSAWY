// الاتصال بـ Supabase — يستخدم في كل الموقع للمصادقة (Auth) وقاعدة البيانات.
// القيم دي بتيجي من متغيرات البيئة (راجع .env.example و README.md لشرح إزاي تحصل عليها).

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ لازم تحط VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env — راجع README.md'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
