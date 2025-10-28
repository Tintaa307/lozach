"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { ProductService } from "@/services/products/product-service"
import { AuthService } from "@/services/auth/auth-service"
import {
  CreateProductValues,
  UpdateProductValues,
  Product,
} from "@/types/products/types"

const productService = new ProductService()
const authService = new AuthService()

// Helper function to verify admin role
async function verifyAdminRole() {
  const user = await authService.getUser()
  if (user.role !== "admin") {
    throw new Error("Solo los administradores pueden realizar esta acción")
  }
  return user
}

export const getAllProducts = async () => {
  return actionHandler(async () => {
    const products = await productService.getAllProducts()
    return products as Product[]
  })
}

export const getProductById = async (id: number) => {
  return actionHandler(async () => {
    const product = await productService.getProductById(id)
    return product as Product
  })
}

export const createProduct = async (values: CreateProductValues) => {
  return actionHandler(async () => {
    const user = await verifyAdminRole()
    const product = await productService.createProduct(values, user.id)
    return product as Product
  })
}

export const updateProduct = async (
  id: number,
  values: UpdateProductValues
) => {
  return actionHandler(async () => {
    const user = await verifyAdminRole()
    const product = await productService.updateProduct(id, values, user.id)
    return product as Product
  })
}

export const deleteProduct = async (id: number) => {
  return actionHandler(async () => {
    const user = await verifyAdminRole()
    await productService.deleteProduct(id, user.id)
    return undefined
  })
}
