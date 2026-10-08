-- Ejecutar en Supabase > SQL Editor.
-- Requiere activar Authentication > Providers > "Allow anonymous sign-ins".

create table if not exists public.players (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  mode text not null check (mode in ('pvp', 'cpu')),
  winner text not null check (winner in ('X', 'O', 'draw')),
  winning_line int[],
  moves jsonb not null,
  move_count int not null,
  duration_ms int not null,
  created_at timestamptz not null default now()
);

create index if not exists games_player_idx on public.games (player_id, created_at desc);

alter table public.players enable row level security;
alter table public.games enable row level security;

create policy "players: ver propio" on public.players
  for select using (auth.uid() = id);
create policy "players: crear propio" on public.players
  for insert with check (auth.uid() = id);
create policy "players: editar propio" on public.players
  for update using (auth.uid() = id);

create policy "games: ver propias" on public.games
  for select using (auth.uid() = player_id);
create policy "games: crear propias" on public.games
  for insert with check (auth.uid() = player_id);

-- Estadísticas derivadas (respeta RLS del usuario que consulta).
create or replace view public.player_stats
with (security_invoker = true) as
select
  player_id,
  mode,
  count(*) filter (where winner = 'X') as wins_x,
  count(*) filter (where winner = 'O') as wins_o,
  count(*) filter (where winner = 'draw') as draws,
  count(*) as total
from public.games
group by player_id, mode;
