import { BaseException } from "@/exceptions/base/base-exceptions"

export interface ActionResponse<T> {
  success: boolean
  data?: T
  message?: string
  statusCode?: number
  fieldErrors?: Record<string, string[]>
}

export async function actionHandler<T>(
  action: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const data = await action()
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof BaseException) {
      return {
        success: false,
        message: error.userMessage,
        statusCode: error.statusCode,
        fieldErrors: error.fieldErrors,
      }
    }

    // Handle unexpected errors
    console.error("Unexpected error in action handler:", error)
    return {
      success: false,
      message: "Error interno del servidor",
      statusCode: 500,
    }
  }
}
