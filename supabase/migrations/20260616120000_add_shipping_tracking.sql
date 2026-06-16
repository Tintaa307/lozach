alter table public.shipping
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists imported_at timestamptz,
  add column if not exists last_synced_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists last_tracking_status text,
  add column if not exists in_transit_email_sent boolean not null default false,
  add column if not exists delivered_email_sent boolean not null default false;

-- Índice para que el cron recorra primero los envíos hace más tiempo sin sincronizar.
create index if not exists shipping_tracking_sync_idx
  on public.shipping (last_synced_at)
  where tracking_number is not null
    and shipping_status not in ('delivered', 'cancelled');

comment on column public.shipping.tracking_number is
  'Número de seguimiento devuelto por Correo Argentino al importar el envío.';
comment on column public.shipping.tracking_url is
  'URL pública de seguimiento del envío, si la API la provee.';
comment on column public.shipping.imported_at is
  'Momento en que el envío se importó a Correo Argentino.';
comment on column public.shipping.last_synced_at is
  'Última vez que el cron consultó el tracking del envío.';
comment on column public.shipping.delivered_at is
  'Momento en que el envío se marcó como entregado.';
comment on column public.shipping.last_tracking_status is
  'Texto del último evento de tracking informado por Correo Argentino.';
comment on column public.shipping.in_transit_email_sent is
  'Evita reenviar el email de "en camino" al cliente.';
comment on column public.shipping.delivered_email_sent is
  'Evita reenviar el email de "entregado" al cliente.';
