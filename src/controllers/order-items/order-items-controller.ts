"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { OrderItemsService } from "@/services/order-items/order-items-service"
import { OrderItem } from "@/types/order-items/order-items"

const orderItemsService = new OrderItemsService()

export const getOrderItemsByOrderId = async (orderId: string) => {
  return actionHandler(async () => {
    const orderItems = await orderItemsService.getOrderItemsByOrderId(orderId)

    return orderItems as OrderItem[]
  })
}
