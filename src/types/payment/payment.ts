import { CheckoutShippingMethod } from "../shipping/shipping"

export interface CreatePreferenceValues {
  products: Array<{
    id: number
    quantity: number
    color: string
    size: string
  }>
  identifier: string
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  shipping_method: CheckoutShippingMethod
  shipping_cost: number
  agency_code?: string
  agency_name?: string
  agency_address?: string
  save_info: boolean
}

export type UpdatePreferenceValues = {
  external_reference: string
  payment_id: string
  collection_status: "pending" | "approved" | "rejected"
}

export type CreatePreferenceResponse = {
  init_point: string
}

export type CreateBankTransferOrderResponse = {
  redirect_url: string
  external_reference: string
  total_amount: number
  discount_amount: number
}
