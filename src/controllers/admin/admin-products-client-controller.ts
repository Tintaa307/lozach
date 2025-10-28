"use client"

import {
  CreateProductValues,
  UpdateProductValues,
  Product,
} from "@/types/products/types"
import { ApiResponse } from "@/types/base/types"
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./admin-products-controller"

export async function createProductClientAction(
  values: CreateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const result = await createProduct(values)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Producto creado exitosamente",
      }
    }

    return {
      status: result.status || 500,
      error: result.error || "Error al crear el producto",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al crear el producto",
    }
  }
}

export async function updateProductClientAction(
  id: number,
  values: UpdateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const result = await updateProduct(id, values)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Producto actualizado exitosamente",
      }
    }

    return {
      status: result.status || 500,
      error: result.error || "Error al actualizar el producto",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al actualizar el producto",
    }
  }
}

export async function deleteProductClientAction(
  id: number
): Promise<ApiResponse<void>> {
  try {
    const result = await deleteProduct(id)

    if (result.success) {
      return {
        status: 200,
        data: undefined,
        message: "Producto eliminado exitosamente",
      }
    }

    return {
      status: result.status || 500,
      error: result.error || "Error al eliminar el producto",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al eliminar el producto",
    }
  }
}
