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
  postal_code: number
  city: string
  state: string
  phone: string
  identifier: number
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
  postal_code: number
  city: string
  state: string
  phone: string
  identifier: number
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
  postal_code?: number
  city?: string
  state?: string
  phone?: string
  identifier?: number
  shipping_status: ShippingStatus
  updated_at: string
}
