"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/lib/handlers/actionHandler"
import { PaymentService } from "@/services/payment/payment-service"
import { OrderService } from "@/services/orders/order-service"
import { AuthService } from "@/services/auth/auth-service"

const paymentService = new PaymentService()
const orderService = new OrderService()
const authService = new AuthService()

async function verifyAdminRole() {
  const user = await authService.getUser()
  if (user.role !== "admin") {
    throw new Error("Solo los administradores pueden realizar esta acción")
  }
  return user
}

export const approveBankTransferOrder = async (orderId: string) => {
  return actionHandler(async () => {
    await verifyAdminRole()
    await paymentService.approveBankTransferOrder(orderId)
    revalidatePath("/dashboard/orders")
    revalidatePath(`/dashboard/orders/${orderId}`)
    return { ok: true }
  })
}

export const rejectBankTransferOrder = async (
  orderId: string,
  reason?: string
) => {
  return actionHandler(async () => {
    await verifyAdminRole()
    await paymentService.rejectBankTransferOrder(orderId, reason)
    revalidatePath("/dashboard/orders")
    revalidatePath(`/dashboard/orders/${orderId}`)
    return { ok: true }
  })
}

export const getOrderDetailAction = async (orderId: string) => {
  return actionHandler(async () => {
    await verifyAdminRole()
    const order = await orderService.getOrderWithItemsById(orderId)
    return order
  })
}
