-- Enums
create type public.app_role as enum ('admin', 'client');
create type public.request_status as enum ('nova', 'em_andamento', 'concluida', 'cancelada');
create type public.project_status as enum ('rascunho', 'em_producao', 'liberado', 'publicado');

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  business_name text,
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to authenticated;
grant update (full_name, phone, business_name) on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users read own profile, admin reads all" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- New user: profile + role (admin email gets admin role)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.email, ''));

  if lower(coalesce(new.email, '')) = 'meell.webcriativa@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'client');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Custom site requests
create table public.site_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  segment text not null,
  description text not null default '',
  colors text not null default '',
  style text not null default '',
  pages text[] not null default '{}',
  contact_whatsapp text not null default '',
  contact_instagram text not null default '',
  contact_email text not null default '',
  contact_address text not null default '',
  logo_path text,
  photo_paths text[] not null default '{}',
  references_text text not null default '',
  status public.request_status not null default 'nova',
  admin_notes text not null default '',
  project_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.site_requests to authenticated;
grant all on public.site_requests to service_role;
alter table public.site_requests enable row level security;
create trigger site_requests_updated_at before update on public.site_requests
  for each row execute function public.set_updated_at();

create policy "Clients read own requests, admin all" on public.site_requests for select to authenticated
  using (client_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Clients create own requests" on public.site_requests for insert to authenticated
  with check (client_id = auth.uid() and status = 'nova');
create policy "Admin updates requests" on public.site_requests for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes requests" on public.site_requests for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Projects (sites)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  segment text not null default '',
  template text not null default '',
  status public.project_status not null default 'rascunho',
  slug text unique,
  content jsonb not null default '{}'::jsonb,
  request_id uuid references public.site_requests(id) on delete set null,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_requests
  add constraint site_requests_project_fk foreign key (project_id) references public.projects(id) on delete set null;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

create policy "Owners read own projects, admin all" on public.projects for select to authenticated
  using (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Owners create own projects, admin any" on public.projects for insert to authenticated
  with check (
    (owner_id = auth.uid() and status = 'rascunho')
    or public.has_role(auth.uid(), 'admin')
  );
create policy "Owners update own released projects, admin any" on public.projects for update to authenticated
  using ((owner_id = auth.uid() and status <> 'em_producao') or public.has_role(auth.uid(), 'admin'))
  with check ((owner_id = auth.uid() and status <> 'em_producao') or public.has_role(auth.uid(), 'admin'));
create policy "Owners delete own drafts, admin any" on public.projects for delete to authenticated
  using ((owner_id = auth.uid() and status = 'rascunho') or public.has_role(auth.uid(), 'admin'));

-- Storage: uploads bucket, files under <user_id>/...
create policy "Users upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read own files, admin all" on storage.objects for select to authenticated
  using (bucket_id = 'uploads' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(), 'admin')));
create policy "Users delete own files, admin all" on storage.objects for delete to authenticated
  using (bucket_id = 'uploads' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(), 'admin')));