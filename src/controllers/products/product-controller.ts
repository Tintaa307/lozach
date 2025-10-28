import { ProductService } from "@/services/products/product-service"
import { Product } from "@/types/types"
import {
  CreateProductValues,
  UpdateProductValues,
  ProductFilters,
} from "@/types/products/types"
import { ApiResponse } from "@/types/base/types"
import { createClient } from "@/lib/supabase/server"

const productService = new ProductService()

export async function getProducts(
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> {
  try {
    const products = await productService.getAllProducts(filters)
    return {
      status: 200,
      data: products,
      message: "Productos obtenidos exitosamente",
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

export async function getProductById(
  id: number
): Promise<ApiResponse<Product>> {
  try {
    const product = await productService.getProductById(id)
    return {
      status: 200,
      data: product,
      message: "Producto obtenido exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener el producto"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}

export async function getProductsByIds(
  ids: number[]
): Promise<ApiResponse<Product[]>> {
  try {
    const products = await productService.getProductsByIds(ids)
    return {
      status: 200,
      data: products,
      message: "Productos obtenidos exitosamente",
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

export async function getProductsByNames(
  names: string[]
): Promise<ApiResponse<Product[]>> {
  try {
    const products = await productService.getProductsByNames(names)
    return {
      status: 200,
      data: products,
      message: "Productos obtenidos exitosamente",
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

export async function createProduct(
  values: CreateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    const product = await productService.createProduct(values, user.id)
    return {
      status: 200,
      data: product,
      message: "Producto creado exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear el producto"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}

export async function updateProduct(
  id: number,
  values: UpdateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    const product = await productService.updateProduct(id, values, user.id)
    return {
      status: 200,
      data: product,
      message: "Producto actualizado exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al actualizar el producto"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}

export async function deleteProduct(id: number): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        status: 401,
        error: "Usuario no autenticado",
      }
    }

    await productService.deleteProduct(id, user.id)
    return {
      status: 200,
      data: undefined,
      message: "Producto eliminado exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al eliminar el producto"
    return {
      status: 500,
      error: errorMessage,
    }
  }
}
