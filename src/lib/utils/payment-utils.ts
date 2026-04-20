export const MERCADO_PAGO_PAYMENT_TYPE = "mercadopago"
export const BANK_TRANSFER_PAYMENT_TYPE = "bank_transfer"
export const BANK_TRANSFER_DISCOUNT_RATE = 0.2

export function calculateBankTransferDiscount(subtotal: number): number {
  return Math.round(Math.max(0, subtotal) * BANK_TRANSFER_DISCOUNT_RATE)
}

export function calculateBankTransferTotal(
  subtotal: number,
  shippingCost: number
): number {
  const discount = calculateBankTransferDiscount(subtotal)

  return Math.max(0, subtotal - discount + Math.max(0, shippingCost))
}

export function getPaymentTypeLabel(paymentType?: string | null): string {
  if (paymentType === MERCADO_PAGO_PAYMENT_TYPE) {
    return "Mercado Pago"
  }

  if (paymentType === BANK_TRANSFER_PAYMENT_TYPE) {
    return "Transferencia bancaria"
  }

  return paymentType || "Sin método"
}
