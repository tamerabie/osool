-- =====================================================================
--  أصول | Osool — Supabase schema (Postgres) + Row Level Security
--  يطابق كيانات Base44 الثمانية + جدول الأدوار.
--  شغّله في Supabase SQL Editor بعد إنشاء المشروع.
-- =====================================================================

-- ---------- الأدوار (profiles) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- دالة مساعدة: هل المستخدم الحالي مدير؟
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- المعاملات ----------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_id text unique,
  client_name text,
  user_id uuid references auth.users(id),
  created_by uuid references auth.users(id),
  transaction_type text,
  governorate text,
  description text,
  status text not null default 'pending_review'
    check (status in ('pending_review','accepted_similar','accepted_agreement',
                      'in_progress','completed','rejected','closed')),
  rejection_reason text,
  similar_transaction_id text,
  start_date date,
  expected_end_date date,
  expected_fees numeric default 0,
  agreed_fees numeric default 0,
  paid_fees numeric default 0,
  remaining numeric default 0,
  steps text[] default '{}',
  next_step text,
  next_step_date date,
  files text[] default '{}',
  closure_comment text,
  client_confirmed boolean default false,
  archived boolean default false,
  archived_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.transactions enable row level security;
create policy tx_select on public.transactions for select
  using (public.is_admin() or user_id = auth.uid() or created_by = auth.uid());
create policy tx_insert on public.transactions for insert
  with check (auth.uid() is not null);
create policy tx_update on public.transactions for update
  using (public.is_admin() or user_id = auth.uid());
create policy tx_delete on public.transactions for delete
  using (public.is_admin());

-- ---------- المدفوعات (admin only) ----------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  transaction_id text,
  amount numeric not null,
  payment_date date default now(),
  payment_method text check (payment_method in ('cash','card')),
  card_number text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy pay_all on public.payments for all using (public.is_admin()) with check (public.is_admin());

-- ---------- المصروفات (admin only) ----------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  transaction_id text,
  amount numeric not null,
  delegate_name text,
  payment_entity text,
  description text,
  expense_date date not null default now(),
  created_at timestamptz not null default now()
);
alter table public.expenses enable row level security;
create policy exp_all on public.expenses for all using (public.is_admin()) with check (public.is_admin());

-- ---------- الإجازات (public read, admin write) ----------
create table if not exists public.holidays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  created_at timestamptz not null default now()
);
alter table public.holidays enable row level security;
create policy hol_read on public.holidays for select using (true);
create policy hol_write on public.holidays for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- مكتبة أصول (public read, admin write) ----------
create table if not exists public.library_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  summary text,
  organization text,
  governorate text,
  category text check (category in ('circular','decision','publication','instructions','letter','note','other')),
  tags text[] default '{}',
  keywords text,
  source_type text default 'text' check (source_type in ('text','voice')),
  audio_url text,
  reference_number text,
  date_issued date,
  created_at timestamptz not null default now()
);
alter table public.library_entries enable row level security;
create policy lib_read on public.library_entries for select using (true);
create policy lib_write on public.library_entries for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- طلبات التعديل (owner read, admin write) ----------
create table if not exists public.modification_requests (
  id uuid primary key default gen_random_uuid(),
  transaction_id text not null,
  modification_type text not null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  impact_report text,
  admin_notes text,
  created_at timestamptz not null default now()
);
alter table public.modification_requests enable row level security;
create policy mod_read on public.modification_requests for select
  using (public.is_admin() or created_by = auth.uid());
create policy mod_insert on public.modification_requests for insert
  with check (auth.uid() is not null);
create policy mod_write on public.modification_requests for update
  using (public.is_admin());

-- ---------- إعدادات النظام (admin only) ----------
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  created_at timestamptz not null default now()
);
alter table public.system_settings enable row level security;
create policy sys_all on public.system_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- مواعيد المراجعات (admin only) ----------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  transaction_id text,
  appointment_date date not null,
  appointment_time time,
  official_entity text,
  governorate text,
  status text not null default 'upcoming' check (status in ('upcoming','attended','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.appointments enable row level security;
create policy apt_all on public.appointments for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- إنشاء أول مستخدم مدير ----------
-- بعد إنشاء حساب من واجهة الموقع، نفّذ:
-- update public.profiles set role='admin' where id = '<uuid-of-your-user>';

-- ---------- Trigger: إنشاء profile تلقائياً عند التسجيل ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- إصلاحات وتحديثات الإصدار الحالي
insert into storage.buckets (id, name, public) values ('transaction-files', 'transaction-files', true) on conflict (id) do update set public = true;
drop policy if exists transaction_files_read on storage.objects;
drop policy if exists transaction_files_insert on storage.objects;
create policy transaction_files_read on storage.objects for select using (bucket_id = 'transaction-files');
create policy transaction_files_insert on storage.objects for insert with check (bucket_id = 'transaction-files' and auth.uid() is not null);

create or replace function public.sync_transaction_paid_fees()
returns trigger language plpgsql security definer as $$
begin
  update public.transactions set paid_fees = coalesce((select sum(amount) from public.payments where transaction_id = new.transaction_id), 0), remaining = greatest(coalesce(agreed_fees, expected_fees, 0) - coalesce((select sum(amount) from public.payments where transaction_id = new.transaction_id), 0), 0), updated_at = now() where transaction_id = coalesce(new.transaction_id, old.transaction_id);
  return coalesce(new, old);
end; $$;
drop trigger if exists payments_sync_transaction on public.payments;
create trigger payments_sync_transaction after insert or update or delete on public.payments for each row execute function public.sync_transaction_paid_fees();
