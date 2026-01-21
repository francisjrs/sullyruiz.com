create table public.orders (
  order_number text not null,
  customer_name text null,
  customer_email text null,
  items_count bigint null,
  date_ordered text null,
  order_total double precision null,
  currency text null,
  order_status text null,
  payment_method text null,
  shipping_country text null,
  constraint orders_pkey primary key (order_number)
) TABLESPACE pg_default;