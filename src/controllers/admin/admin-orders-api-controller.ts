import { OrderService } from "@/services/orders/order-service"
import { AuthService } from "@/services/auth/auth-service"
import { OrderWithItems } from "@/types/order/order"
import { ApiResponse } from "@/types/base/types"

const orderService = new OrderService()
const authService = new AuthService()

async function verifyAdminRole() {
  const user = await authService.getUser()
  if (user.role !== "admin") {
    throw new Error("Solo los administradores pueden realizar esta acción")
  }
  return user
}

export async function getAllOrdersAction(): Promise<ApiResponse<OrderWithItems[]>> {
  try {
    await verifyAdminRole()
    const orders = await orderService.getAllOrders()
    return {
      status: 200,
      data: orders,
      message: "Órdenes obtenidas exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}
