"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { CreatePreferenceValues } from "@/types/payment/payment"
import { PaymentService } from "@/services/payment/payment-service"
import { OrderService } from "@/services/orders/order-service"

const paymentService = new PaymentService()
const orderService = new OrderService()

export const createPreference = async (values: CreatePreferenceValues) => {
  return actionHandler(async () => {
    const result = await paymentService.createPreference(values)

    return result
  })
}

export const createBankTransferOrder = async (
  values: CreatePreferenceValues
) => {
  return actionHandler(async () => {
    const result = await paymentService.createBankTransferOrder(values)

    return result
  })
}

export const verifyPaymentStatus = async (externalReference: string) => {
  return actionHandler(async () => {
    const order =
      await orderService.getOrderByExternalReference(externalReference)

    return {
      status: order.collection_status,
      orderId: order.id,
    }
  })
}
