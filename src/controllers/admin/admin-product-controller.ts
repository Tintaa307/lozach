"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { ProductService } from "@/services/products/product-service"
import {
  CreateProductValues,
  UpdateProductValues,
} from "@/types/products/types"
import { AuthService } from "@/services/auth/auth-service"

const productService = new ProductService()
const authService = new AuthService()

export const createProduct = async (values: CreateProductValues) => {
  return actionHandler(async () => {
    // Get current user to verify admin role
    const user = await authService.getUser()

    if (user.role !== "admin") {
      throw new Error("Solo los administradores pueden crear productos")
    }

    return await productService.createProduct(values, user.id)
  })
}

export const updateProduct = async (
  id: number,
  values: UpdateProductValues
) => {
  return actionHandler(async () => {
    // Get current user to verify admin role
    const user = await authService.getUser()

    if (user.role !== "admin") {
      throw new Error("Solo los administradores pueden actualizar productos")
    }

    return await productService.updateProduct(id, values, user.id)
  })
}

export const deleteProduct = async (id: number) => {
  return actionHandler(async () => {
    // Get current user to verify admin role
    const user = await authService.getUser()

    if (user.role !== "admin") {
      throw new Error("Solo los administradores pueden eliminar productos")
    }

    return await productService.deleteProduct(id, user.id)
  })
}
