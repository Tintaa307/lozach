import { Order } from "../order/order"
import { Shipping } from "../shipping/shipping"
import { Product } from "../types"

export interface EmailBody {
  name: string
  email: string
  buyedProducts: Product[]
  order: Order
  shipping: Shipping
}
