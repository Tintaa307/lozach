import { ProductService } from "@/services/products/product-service"
import { AuthService } from "@/services/auth/auth-service"
import {
  CreateProductValues,
  UpdateProductValues,
  Product,
} from "@/types/products/types"
import { ApiResponse } from "@/types/base/types"

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

export async function getAllProductsAction(): Promise<ApiResponse<Product[]>> {
  try {
    const products = await productService.getAllProducts()
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

export async function getProductByIdAction(
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

export async function createProductAction(
  values: CreateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const user = await verifyAdminRole()
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

export async function updateProductAction(
  id: number,
  values: UpdateProductValues
): Promise<ApiResponse<Product>> {
  try {
    const user = await verifyAdminRole()
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

export async function deleteProductAction(
  id: number
): Promise<ApiResponse<undefined>> {
  try {
    const user = await verifyAdminRole()
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
