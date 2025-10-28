export interface Order {
  id: string
  created_at: string
  updated_at: string
  total_amount: number
  subtotal: number
  user_id: string
  payment_id: string | null
  payment_type: string | null
  collection_id: string | null
  collection_status: string | null
  external_reference: string | null
  currency: string
  phone: string
  email_sent?: boolean
  processed_at?: string | null
  expires_at?: string | null
}

export interface CreateOrderValues {
  total_amount: number
  subtotal: number
  user_id: string
  payment_id: string | null
  payment_type: string | null
  collection_id: string | null
  collection_status: string | null
  external_reference: string | null
  currency: string
  phone: string
  expires_at?: string | null
}

export interface UpdateOrderValues {
  total_amount?: number
  subtotal?: number
  payment_id?: string
  payment_type?: string
  collection_id?: string
  collection_status?: string
  external_reference?: string
  phone?: string
  email_sent?: boolean
  processed_at?: string | null
  expires_at?: string | null
  updated_at?: string | null
}
