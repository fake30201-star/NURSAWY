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

// ملاحظة: بنسيب آلية "Navigator Lock" الافتراضية في مكتبة Supabase شغالة زي ما هي
// (من غير أي تعديل عليها). هي المسؤولة عن تنسيق تجديد جلسة الدخول (Refresh Token)
// بين أكتر من تاب/نافذة مفتوحة لنفس الموقع في نفس الوقت، عشان تاب واحد بس يجدد
// الجلسة في كل لحظة بدل ما كل تاب يحاول لوحده — ده اللي بيمنع أخطاء زي
// "AuthRefreshDiscardedError" وأخطاء 429 (طلبات كتير أوي) اللي بتحصل لو الموقع
// مفتوح في أكتر من تاب واحد.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
