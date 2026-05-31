create table if not exists public.dashboard_app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_dashboard_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_dashboard_app_state_updated_at on public.dashboard_app_state;

create trigger trg_dashboard_app_state_updated_at
before update on public.dashboard_app_state
for each row
execute function public.set_dashboard_app_state_updated_at();

alter table public.dashboard_app_state enable row level security;

comment on table public.dashboard_app_state is 'Estado persistente del dashboard gerente. Se escribe desde Vercel /api/state usando service role server-side.';
