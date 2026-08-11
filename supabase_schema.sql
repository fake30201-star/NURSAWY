-- ==========================================================
-- إعداد قاعدة بيانات Nursawy على Supabase
-- طريقة الاستخدام: افتح مشروعك على supabase.com → SQL Editor → New query
-- الصق الكود ده كله ودوس Run (مرة واحدة بس عند الإعداد الأول)
-- ==========================================================

-- جدول بيانات المستخدمين الإضافية (فوق نظام Auth المدمج في Supabase)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  is_subscribed boolean not null default false,
  created_at timestamptz not null default now()
);

-- جدول نصوص الموقع القابلة للتعديل من الأدمن
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- تفعيل الحماية على مستوى الصفوف (Row Level Security) — إلزامي في Supabase
alter table public.profiles enable row level security;
alter table public.site_content enable row level security;

-- ---------- صلاحيات جدول profiles ----------
-- أي مستخدم مسجل يقدر يشوف بياناته هو بس
drop policy if exists "select_own_profile" on public.profiles;
create policy "select_own_profile" on public.profiles
  for select using (auth.uid() = id);

-- أي مستخدم مسجل يقدر ينشئ صف بياناته هو بس عند التسجيل
drop policy if exists "insert_own_profile" on public.profiles;
create policy "insert_own_profile" on public.profiles
  for insert with check (auth.uid() = id);

-- ---------- صلاحيات جدول site_content ----------
-- أي حد (حتى زوار غير مسجلين) يقدر يقرأ محتوى الموقع
drop policy if exists "public_read_content" on public.site_content;
create policy "public_read_content" on public.site_content
  for select using (true);

-- بس الأدمن (is_admin = true) هو اللي يقدر يعدّل أو يضيف محتوى
drop policy if exists "admin_write_content" on public.site_content;
create policy "admin_write_content" on public.site_content
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "admin_update_content" on public.site_content;
create policy "admin_update_content" on public.site_content
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ==========================================================
-- تمام! دلوقتي سجّل حساب عادي من صفحة "حساب جديد" في الموقع.
-- بعدها روح لـ Table Editor → profiles، ولاقي حسابك، وغيّر عمود
-- is_admin من false لـ true يدويًا. كده حسابك بس هو اللي يقدر يعدل الموقع.
-- ==========================================================
