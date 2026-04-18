import { OrderItem } from "../order-items/order-items"
import { Order } from "../order/order"
import { CreateShippingValues, Shipping } from "../shipping/shipping"
import { Product } from "../types"

export interface EmailBody {
  name: string
  email: string
  buyedProducts: Product[]
  order: Order
  shipping: Shipping | null
  orderItems: OrderItem[]
}

export interface AdminOrderNotificationBody {
  customerName: string
  customerEmail: string
  order: Order
  orderItems: OrderItem[]
  shipping: CreateShippingValues | null
}
