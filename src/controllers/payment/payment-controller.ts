"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { CreatePreferenceValues } from "@/types/payment/payment"
import { PaymentService } from "@/services/payment/payment-service"

const paymentService = new PaymentService()

export const createPreference = async (values: CreatePreferenceValues) => {
  return actionHandler(async () => {
    const result = await paymentService.createPreference(values)

    return result
  })
}
