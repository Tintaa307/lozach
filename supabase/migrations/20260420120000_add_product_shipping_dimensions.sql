alter table public.products
  add column if not exists shipping_weight_grams integer,
  add column if not exists shipping_height_cm numeric(8, 2),
  add column if not exists shipping_width_cm numeric(8, 2),
  add column if not exists shipping_length_cm numeric(8, 2);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_shipping_weight_grams_check'
  ) then
    alter table public.products
      add constraint products_shipping_weight_grams_check
      check (
        shipping_weight_grams is null
        or (shipping_weight_grams > 0 and shipping_weight_grams <= 25000)
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'products_shipping_height_cm_check'
  ) then
    alter table public.products
      add constraint products_shipping_height_cm_check
      check (
        shipping_height_cm is null
        or (shipping_height_cm > 0 and shipping_height_cm <= 150)
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'products_shipping_width_cm_check'
  ) then
    alter table public.products
      add constraint products_shipping_width_cm_check
      check (
        shipping_width_cm is null
        or (shipping_width_cm > 0 and shipping_width_cm <= 150)
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'products_shipping_length_cm_check'
  ) then
    alter table public.products
      add constraint products_shipping_length_cm_check
      check (
        shipping_length_cm is null
        or (shipping_length_cm > 0 and shipping_length_cm <= 150)
      );
  end if;
end $$;

comment on column public.products.shipping_weight_grams is
  'Peso del paquete del producto en gramos para cotización de Correo Argentino.';
comment on column public.products.shipping_height_cm is
  'Alto del paquete del producto en centímetros para cotización de Correo Argentino.';
comment on column public.products.shipping_width_cm is
  'Ancho del paquete del producto en centímetros para cotización de Correo Argentino.';
comment on column public.products.shipping_length_cm is
  'Largo del paquete del producto en centímetros para cotización de Correo Argentino.';
