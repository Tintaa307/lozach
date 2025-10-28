"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { ShippingService } from "@/services/shipping/shipping-service"
import { Shipping } from "@/types/shipping/shipping"

const shippingService = new ShippingService()

export const getShippingByOrderId = async (orderId: string) => {
  return actionHandler(async () => {
    const shipping = await shippingService.getShippingByOrderId(orderId)
    return shipping as Shipping
  })
}
