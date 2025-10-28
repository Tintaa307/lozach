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
  shipping_method: "home" | "express" | "store"
  shipping_cost: string
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
