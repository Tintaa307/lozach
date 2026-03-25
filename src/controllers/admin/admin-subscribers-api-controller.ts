import { SubscribersService } from "@/services/subscribers/subscribers-service"
import { AuthService } from "@/services/auth/auth-service"
import { Subscriber } from "@/repositories/subscribers/subscribers-repository"
import { ApiResponse } from "@/types/base/types"

const subscribersService = new SubscribersService()
const authService = new AuthService()

async function verifyAdminRole() {
  const user = await authService.getUser()
  if (user.role !== "admin") {
    throw new Error("Solo los administradores pueden realizar esta acción")
  }
  return user
}

export async function getAllSubscribersAction(): Promise<
  ApiResponse<Subscriber[]>
> {
  try {
    await verifyAdminRole()
    const subscribers = await subscribersService.getAllSubscribers()
    return {
      status: 200,
      data: subscribers,
      message: "Suscriptores obtenidos exitosamente",
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
