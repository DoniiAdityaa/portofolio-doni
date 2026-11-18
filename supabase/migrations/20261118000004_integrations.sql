-- M6 integrations: rate-limited contact messages and visitor statistics (Case 02 §10).

-- ---------------------------------------------------------------------------
-- Contact messages: sent only through submit_contact_message(), which enforces
-- the rate limit (max 3 per visitor per hour, Case 02 §15).
-- ---------------------------------------------------------------------------

alter table public.contact_messages add column visitor_hash text;
create index contact_messages_rate_limit_idx
  on public.contact_messages (visitor_hash, created_at);

drop policy "Anyone sends a message" on public.contact_messages;
revoke insert on public.contact_messages from anon, authenticated;

/** Saves a contact message unless the visitor already sent `max_per_hour` this hour. */
create function public.submit_contact_message(
  sender_name text,
  sender_email text,
  message_body text,
  sender_hash text,
  max_per_hour int default 3
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent int;
begin
  select count(*) into recent
  from public.contact_messages
  where visitor_hash = sender_hash and created_at > now() - interval '1 hour';

  if recent >= max_per_hour then
    return 'rate_limited';
  end if;

  insert into public.contact_messages (name, email, message, visitor_hash)
  values (sender_name, sender_email, message_body, sender_hash);
  return 'sent';
end;
$$;

revoke execute on function public.submit_contact_message(text, text, text, text, int) from public;
grant execute on function public.submit_contact_message(text, text, text, text, int)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- record_page_view(): an empty referrer means a direct visit, stored as null.
-- ---------------------------------------------------------------------------

create or replace function public.record_page_view(
  view_path text,
  view_locale text,
  view_referrer_host text,
  view_visitor_hash text
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.page_views (path, locale, referrer_host, visitor_hash)
  values (
    left(view_path, 300),
    view_locale,
    nullif(left(view_referrer_host, 255), ''),
    view_visitor_hash
  );
$$;

-- ---------------------------------------------------------------------------
-- Visitor statistics for the admin Overview. Runs as the caller, so RLS lets
-- only the admin read page_views. Visitor hashes rotate daily, so "visitors"
-- means unique visitors per day.
-- ---------------------------------------------------------------------------

create function public.daily_visitor_stats(days int default 30)
returns table (day date, views bigint, visitors bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    series.day::date,
    count(page_views.id) as views,
    count(distinct page_views.visitor_hash) as visitors
  from generate_series(
    (now() at time zone 'utc')::date - (days - 1),
    (now() at time zone 'utc')::date,
    interval '1 day'
  ) as series(day)
  left join public.page_views
    on (page_views.created_at at time zone 'utc')::date = series.day::date
  group by series.day
  order by series.day;
$$;

revoke execute on function public.daily_visitor_stats(int) from public;
grant execute on function public.daily_visitor_stats(int) to authenticated;
