export type CheckoutShippingMethod = "home" | "branch" | "store"
export type ShippingMethod = CheckoutShippingMethod | "express"
export type ShippingProvider = "CA"
export type ShippingStatus = "draft" | "shipped" | "ready" | "cancelled"

export interface Shipping {
  id: string
  created_at: string
  order_id: string
  shipping_method: ShippingMethod
  shipping_cost: number
  user_id: string
  provider: ShippingProvider
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
  shipping_method: ShippingMethod
  shipping_cost: number
  user_id: string
  provider: ShippingProvider
  shipping_status: ShippingStatus
  address: string
  details: string
  postal_code: number
  city: string
  state: string
  phone: string
  identifier: number
}

export interface UpdateShippingValues {
  order_id?: string
  shipping_method?: ShippingMethod
  shipping_cost?: number
  user_id?: string
  provider?: ShippingProvider
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

export interface ShippingQuote {
  cost: number
  estimatedDays: number | null
  provider: "Correo Argentino"
  weightKg: number
  source: "api" | "fallback"
  deliveredType: "D" | "S"
}

export interface CorreoArgentinoAgency {
  code: string
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string | null
}
