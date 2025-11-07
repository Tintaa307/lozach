"use client"

import {
  getProducts,
  getProductById,
  getProductsByIds,
  getProductsByNames,
  searchProducts,
  getRelatedProducts,
} from "./product-controller"
import { Product } from "@/types/types"
import { ProductFilters, CategoryType } from "@/types/products/types"
import { ApiResponse } from "@/types/base/types"

export async function getProductsClientAction(
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> {
  try {
    const result = await getProducts(filters)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Productos obtenidos exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al obtener los productos",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al obtener los productos",
    }
  }
}

export async function getProductByIdClientAction(
  id: number
): Promise<ApiResponse<Product>> {
  try {
    const result = await getProductById(id)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Producto obtenido exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al obtener el producto",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al obtener el producto",
    }
  }
}

export async function getProductsByIdsClientAction(
  ids: number[]
): Promise<ApiResponse<Product[]>> {
  try {
    const result = await getProductsByIds(ids)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Productos obtenidos exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al obtener los productos",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al obtener los productos",
    }
  }
}

export async function getProductsByNamesClientAction(
  names: string[]
): Promise<ApiResponse<Product[]>> {
  try {
    const result = await getProductsByNames(names)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Productos obtenidos exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al obtener los productos",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al obtener los productos",
    }
  }
}

export async function searchProductsClientAction(
  query: string,
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> {
  try {
    const result = await searchProducts(query, filters)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Productos obtenidos exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al buscar productos",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al buscar productos",
    }
  }
}

export async function getRelatedProductsClientAction(
  currentProductId: number,
  category: CategoryType
): Promise<ApiResponse<Product[]>> {
  try {
    const result = await getRelatedProducts(currentProductId, category)

    if (result.success && result.data) {
      return {
        status: 200,
        data: result.data,
        message: "Productos relacionados obtenidos exitosamente",
      }
    }

    return {
      status: result.statusCode || 500,
      error: result.message || "Error al obtener productos relacionados",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    return {
      status: 500,
      error: errorMessage || "Error al obtener productos relacionados",
    }
  }
}

