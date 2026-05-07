alter table public.orders
  add column if not exists payment_proof_url text,
  add column if not exists payment_proof_uploaded_at timestamptz,
  add column if not exists payment_proof_status text,
  add column if not exists payment_proof_reviewed_at timestamptz,
  add column if not exists payment_proof_reviewed_by uuid,
  add column if not exists payment_proof_rejection_reason text,
  add column if not exists reserved_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_payment_proof_status_check'
  ) then
    alter table public.orders
      add constraint orders_payment_proof_status_check
      check (
        payment_proof_status is null
        or payment_proof_status in ('pending_review', 'approved', 'rejected')
      );
  end if;
end $$;

comment on column public.orders.payment_proof_url is
  'URL pública del comprobante de transferencia subido por el cliente.';
comment on column public.orders.payment_proof_uploaded_at is
  'Momento en que el cliente subió el comprobante.';
comment on column public.orders.payment_proof_status is
  'Estado de revisión del comprobante: pending_review, approved, rejected.';
comment on column public.orders.payment_proof_reviewed_at is
  'Momento en que un administrador revisó el comprobante.';
comment on column public.orders.payment_proof_reviewed_by is
  'Usuario administrador que revisó el comprobante.';
comment on column public.orders.payment_proof_rejection_reason is
  'Motivo opcional de rechazo del comprobante.';
comment on column public.orders.reserved_at is
  'Momento en que se reservó el pedido (cliente envió comprobante).';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
