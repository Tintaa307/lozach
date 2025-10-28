export interface Address {
  id: string
  created_at: string
  updated_at: string
  order_id: string
  user_id: string
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  identifier: string
}

export interface CreateAddressValues {
  order_id: string
  user_id: string
  address: string
  details: string
  postal_code: string
  city: string
  state: string
  phone: string
  identifier: string
}
