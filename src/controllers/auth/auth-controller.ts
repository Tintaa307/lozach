"use server"

import { AuthService } from "@/services/auth/auth-service"
import {
  CreateUserValues,
  LoginUserValues,
  PublicUser,
} from "@/types/auth/types"
import { ActionResponse } from "@/lib/handlers/actionHandler"
import { ValidationException } from "@/exceptions/base/base-exceptions"
import {
  AuthCreationException,
  AuthLoginException,
} from "@/exceptions/auth/auth-exceptions"

const authService = new AuthService()

export const createUser = async (
  values: CreateUserValues
): Promise<ActionResponse<unknown>> => {
  try {
    const result = await authService.createUser(values)
    return {
      success: true,
      data: result,
      message: "Usuario creado exitosamente",
    }
  } catch (error) {
    if (error instanceof ValidationException) {
      return {
        success: false,
        message: error.userMessage,
        fieldErrors: error.fieldErrors,
      }
    }

    if (error instanceof AuthCreationException) {
      return {
        success: false,
        message: error.userMessage,
      }
    }

    return {
      success: false,
      message: "Error interno del servidor",
    }
  }
}

export const loginUser = async (
  values: LoginUserValues
): Promise<ActionResponse<unknown>> => {
  try {
    const result = await authService.loginUser(values)
    return {
      success: true,
      data: result,
      message: "Inicio de sesión exitoso",
    }
  } catch (error) {
    if (error instanceof ValidationException) {
      return {
        success: false,
        message: error.userMessage,
        fieldErrors: error.fieldErrors,
      }
    }

    if (error instanceof AuthLoginException) {
      return {
        success: false,
        message: error.userMessage,
      }
    }

    return {
      success: false,
      message: "Error interno del servidor",
    }
  }
}

export const getUser = async (): Promise<ActionResponse<PublicUser>> => {
  try {
    const result = await authService.getUser()
    return {
      success: true,
      data: result,
      message: "Usuario obtenido exitosamente",
    }
  } catch {
    return {
      success: false,
      message: "Error al obtener el usuario",
    }
  }
}

export const getUserById = async (
  id: string
): Promise<ActionResponse<unknown>> => {
  try {
    const result = await authService.getUserById(id)
    return {
      success: true,
      data: result,
    }
  } catch {
    return {
      success: false,
      message: "Error al obtener el usuario",
    }
  }
}

export const logoutUser = async (): Promise<ActionResponse<void>> => {
  try {
    await authService.logoutUser()
    return {
      success: true,
      message: "Sesión cerrada exitosamente",
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "Error al cerrar sesión",
    }
  }
}
