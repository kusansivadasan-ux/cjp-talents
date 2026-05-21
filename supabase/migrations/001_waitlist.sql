-- Waitlist table: stores all signups; converts to users table at full app launch
create table waitlist (
  id                   uuid primary key default gen_random_uuid(),
  full_name            text not null,
  email                text unique not null,
  mobile               text unique not null,
  city                 text not null,
  state                text not null,
  education            text,
  college              text,
  domain               text,
  skills               text[] default '{}',
  purpose              text not null check (purpose in ('job', 'cofounder', 'both')),
  aspiration           text check (char_length(aspiration) <= 120),
  referral_code        text unique not null,
  referred_by          text,
  is_priority_review   boolean default false,
  status               text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  invite_tokens        int default 0,
  tokens_used          int default 0,
  reviewed_at          timestamptz,
  review_notes         text,
  display_number       bigint,
  created_at           timestamptz default now(),
  converted            boolean default false
);

-- Indexes for frequent lookups
create index on waitlist (referral_code);
create index on waitlist (referred_by);
create index on waitlist (status);
create index on waitlist (email);

-- Trigger: auto-assign display_number = 145665 + position (first signup = 145666)
create or replace function assign_display_number()
returns trigger as $$
begin
  -- +1 so the first real signup is #145,666 (seed is 145,665)
  new.display_number := 145665 + (select count(*) from waitlist) + 1;
  return new;
end;
$$ language plpgsql;

create trigger set_display_number
  before insert on waitlist
  for each row execute function assign_display_number();

-- RLS: allow anonymous inserts (signups); only service role reads/updates
alter table waitlist enable row level security;

create policy "Anyone can insert"
  on waitlist for insert
  with check (true);

-- Service role bypasses RLS automatically -- no read policy needed for anon users.
-- Admin reads via Supabase dashboard (service role).
