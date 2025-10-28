"use client"

import { createClient } from "@/lib/supabase/client"
import {
  CreateProductValues,
  UpdateProductValues,
  Product,
} from "@/types/products/types"
import { ApiResponse } from "@/types/base/types"

export async function createProductClientAction(
  values: CreateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    // Llamar al endpoint de la API
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        error: result.message || "Error al crear el producto",
      }
    }

    return {
      status: 200,
      data: result.data,
      message: "Producto creado exitosamente",
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
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    // Llamar al endpoint de la API
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        error: result.message || "Error al actualizar el producto",
      }
    }

    return {
      status: 200,
      data: result.data,
      message: "Producto actualizado exitosamente",
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
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    // Llamar al endpoint de la API
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        error: result.message || "Error al eliminar el producto",
      }
    }

    return {
      status: 200,
      data: undefined,
      message: "Producto eliminado exitosamente",
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
