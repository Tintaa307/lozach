"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { OrderService } from "@/services/orders/order-service"
import { Order } from "@/types/order/order"

const orderService = new OrderService()

export const getOrders = async (userId: string) => {
  return actionHandler(async () => {
    const orders = await orderService.getOrders(userId)

    return orders as Order[]
  })
}
