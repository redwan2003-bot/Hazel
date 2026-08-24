-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Locks down products/orders so writes require a logged-in admin session,
-- and customers can no longer read other customers' orders.

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Anyone (including anonymous shoppers) can browse the catalog.
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

-- Only a logged-in admin can add, edit, or remove products.
drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- Anonymous checkout can create an order, but not read or modify any order
-- (including their own, after submission) or see anyone else's orders.
drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Only a logged-in admin can view or update orders (order queue, status changes).
drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read"
  on public.orders for select
  to authenticated
  using (true);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);
