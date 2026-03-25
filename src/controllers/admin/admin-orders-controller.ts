"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { OrderService } from "@/services/orders/order-service"
import { AuthService } from "@/services/auth/auth-service"
import { OrderWithItems } from "@/types/order/order"

const orderService = new OrderService()
const authService = new AuthService()

async function verifyAdminRole() {
  const user = await authService.getUser()
  if (user.role !== "admin") {
    throw new Error("Solo los administradores pueden realizar esta acción")
  }
  return user
}

export const getAllOrders = async () => {
  return actionHandler(async () => {
    await verifyAdminRole()
    const orders = await orderService.getAllOrders()
    return orders as OrderWithItems[]
  })
}
