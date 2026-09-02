-- ============================================================================
-- Player Analytics Schema
-- Run this in your Supabase SQL editor.
-- ============================================================================

-- Table: player_sessions (one row per gameplay session)
create table player_sessions (
  id              uuid           primary key default gen_random_uuid(),
  player_id       uuid           references auth.users not null,
  started_at      timestamptz    not null,
  last_activity_at timestamptz   not null,
  ended_at        timestamptz,
  created_at      timestamptz    default now()
);

-- Table: gameplay_events (individual events within a session)
create table gameplay_events (
  id          uuid        primary key default gen_random_uuid(),
  player_id   uuid        references auth.users not null,
  session_id  uuid        references player_sessions,
  event_type  text        not null check (event_type in ('session_start','session_end','heartbeat','game_started','game_completed','game_abandoned')),
  metadata    jsonb       default '{}',
  created_at  timestamptz default now()
);

-- Indexes for performance
create index idx_player_sessions_player   on player_sessions(player_id);
create index idx_player_sessions_started   on player_sessions(started_at desc);
create index idx_player_sessions_active    on player_sessions(last_activity_at desc) where ended_at is null;
create index idx_gameplay_events_player    on gameplay_events(player_id);
create index idx_gameplay_events_session   on gameplay_events(session_id);
create index idx_gameplay_events_type      on gameplay_events(event_type);
create index idx_gameplay_events_created   on gameplay_events(created_at);

-- Enable Row Level Security
alter table player_sessions enable row level security;
alter table gameplay_events enable row level security;

-- Policies: users can only see/insert their own data
create policy "Users can view own sessions" on player_sessions for select using (auth.uid() = player_id);
create policy "Users can insert own sessions" on player_sessions for insert with check (auth.uid() = player_id);
create policy "Users can update own sessions" on player_sessions for update using (auth.uid() = player_id);
create policy "Users can view own events" on gameplay_events for select using (auth.uid() = player_id);
create policy "Users can insert own events" on gameplay_events for insert with check (auth.uid() = player_id);

-- ============================================================================
-- DASHBOARD VIEWS
-- ============================================================================

-- View: Active player metrics (DAU, WAU, MAU, currently playing, peak concurrent)
create view player_analytics_metrics as
select
  (select count(*) from auth.users where deleted_at is null) as total_players,
  (select count(distinct player_id) from gameplay_events where created_at > (now() - interval '1 day') and event_type in ('session_start','game_started','heartbeat')) as dau,
  (select count(distinct player_id) from gameplay_events where created_at > (now() - interval '7 day') and event_type in ('session_start','game_started','heartbeat')) as wau,
  (select count(distinct player_id) from gameplay_events where created_at > (now() - interval '30 day') and event_type in ('session_start','game_started','heartbeat')) as mau,
  (select count(distinct ps.player_id) from player_sessions ps where ps.ended_at is null and ps.last_activity_at > (now() - interval '5 minutes')) as playing_now,
  (select count(distinct player_id) from player_sessions where started_at > (now() - interval '24 hours')) as peak_concurrent_today;

-- View: Session metrics
create view session_analytics as
select
  count(*) as total_sessions,
  count(distinct player_id) as unique_players,
  avg(extract(epoch from (last_activity_at - started_at))) as avg_session_seconds,
  sum(extract(epoch from (last_activity_at - started_at))) as total_playtime_seconds
from player_sessions where ended_at is not null and last_activity_at > (now() - interval '30 days');

-- View: Game completion metrics
create view game_completion_metrics as
select
  count(*) filter (where event_type = 'game_started') as games_started,
  count(*) filter (where event_type = 'game_completed') as games_completed,
  count(*) filter (where event_type = 'game_abandoned') as games_abandoned,
  case when count(*) filter (where event_type = 'game_started') > 0
  then round(100.0 * count(*) filter (where event_type = 'game_completed') / count(*) filter (where event_type = 'game_started'), 2)
  else 0 end as completion_rate_pct
from gameplay_events where created_at > (now() - interval '30 days');

-- View: Retention metrics (D1, D7, D30)
create view retention_metrics as
with first_play as (
  select player_id, min(created_at)::date as first_day
  from gameplay_events where event_type in ('game_started', 'session_start')
  group by player_id
),
activity_days as (
  select fp.player_id, fp.first_day,
    bool_or(ge.created_at::date = fp.first_day + interval '1 day') as d1_returned,
    bool_or(ge.created_at::date between fp.first_day and fp.first_day + interval '7 day') as d7_returned,
    bool_or(ge.created_at::date between fp.first_day and fp.first_day + interval '30 day') as d30_returned
  from first_play fp
  join gameplay_events ge on ge.player_id = fp.player_id
  where ge.created_at::date > fp.first_day
  group by fp.player_id, fp.first_day
),
totals as (select count(*) as first_time_players from first_play)
select
  (select count(*) from totals) as first_time_players,
  count(*) as returning_players,
  round(100.0 * sum(case when d1_returned then 1 else 0 end) / (select count(*) from totals), 2) as d1_retention_pct,
  round(100.0 * sum(case when d7_returned then 1 else 0 end) / (select count(*) from totals), 2) as d7_retention_pct,
  round(100.0 * sum(case when d30_returned then 1 else 0 end) / (select count(*) from totals), 2) as d30_retention_pct
from activity_days;

-- View: Per-player summary
create view player_activity_summary as
select
  u.email,
  count(distinct ps.id) as total_sessions,
  sum(extract(epoch from (ps.last_activity_at - ps.started_at)))::int as total_seconds,
  count(ge.id) filter (where ge.event_type = 'game_started') as games_started,
  count(ge.id) filter (where ge.event_type = 'game_completed') as games_completed,
  count(ge.id) filter (where ge.event_type = 'game_abandoned') as games_abandoned,
  max(ps.started_at) as last_played
from auth.users u
left join player_sessions ps on ps.player_id = u.id
left join gameplay_events ge on ge.player_id = u.id
where u.deleted_at is null
group by u.id, u.email
having count(distinct ps.id) > 0
order by max(ps.started_at) desc;
