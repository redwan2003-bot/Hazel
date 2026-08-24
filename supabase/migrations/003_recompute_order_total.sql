-- Run after lock_down_rls.sql.
-- Prevents a tampered client-side cart/total from being trusted: on every
-- order insert, the total is thrown away and recalculated server-side from
-- the live product prices, using the quantities the customer submitted.

create or replace function public.recompute_order_total()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  computed_total numeric;
begin
  select coalesce(sum(p.price * (item->>'quantity')::numeric), 0)
    into computed_total
  from jsonb_array_elements(new.items) as item
  join public.products p on p.id = (item->>'id')::uuid;

  new.total := computed_total;
  return new;
end;
$$;

drop trigger if exists trg_recompute_order_total on public.orders;
create trigger trg_recompute_order_total
  before insert on public.orders
  for each row
  execute function public.recompute_order_total();
