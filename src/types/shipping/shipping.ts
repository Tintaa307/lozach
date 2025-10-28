export interface Shipping {
  id: string
  created_at: string
  order_id: string
  shipping_method: "home" | "express" | "store"
  shipping_cost: number
  user_id: string
  provider: "CA"
  shipping_status: ShippingStatus
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  identifier: string
  updated_at: string
}

export interface CreateShippingValues {
  order_id: string
  shipping_method: "home" | "express" | "store"
  shipping_cost: number
  user_id: string
  provider: "CA"
  shipping_status: ShippingStatus
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  identifier: string
}

export type ShippingStatus = "draft" | "shipped" | "ready" | "cancelled"

export interface UpdateShippingValues {
  order_id?: string
  shipping_method?: "home" | "express" | "store"
  shipping_cost?: number
  user_id?: string
  provider?: "CA"
  address?: string
  details?: string
  postal_code?: string
  city?: string
  state?: string
  phone?: string
  identifier?: string
  shipping_status: ShippingStatus
  updated_at: string
}
