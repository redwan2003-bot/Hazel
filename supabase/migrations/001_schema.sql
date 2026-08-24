-- Run this FIRST, before 002_lock_down_rls.sql and 003_recompute_order_total.sql.
-- Creates the products and orders tables the Hazel storefront code expects.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric not null check (price >= 0),
  category text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  district text not null,
  instructions text,
  items jsonb not null,
  total numeric not null default 0,
  bkash_digits text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);
