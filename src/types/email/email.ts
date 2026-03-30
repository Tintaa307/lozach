import { OrderItem } from "../order-items/order-items"
import { Order } from "../order/order"
import { Shipping } from "../shipping/shipping"
import { Product } from "../types"
import { CreateShippingValues } from "../shipping/shipping"

export interface EmailBody {
  name: string
  email: string
  buyedProducts: Product[]
  order: Order
  shipping: Shipping
  orderItems: OrderItem[]
}

export interface AdminOrderNotificationBody {
  customerName: string
  customerEmail: string
  order: Order
  orderItems: OrderItem[]
  shipping: CreateShippingValues
}
