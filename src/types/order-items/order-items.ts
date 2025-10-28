export interface OrderItem {
  id: string
  order_id: string
  product_id: number
  product_name: string
  sku: string
  currency: string
  quantity: number
  unit_price: number
  color: string
  size: string
  created_at: string
  updated_at: string
}

export interface CreateOrderItemValues {
  order_id: string
  product_id: number
  product_name: string
  sku: string
  currency: string
  quantity: number
  unit_price: number
  color: string
  size: string
}
