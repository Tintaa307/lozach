"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { ProductService } from "@/services/products/product-service"
import {
  CreateProductValues,
  UpdateProductValues,
  ProductFilters,
  CategoryType,
} from "@/types/products/types"

const productService = new ProductService()

export const getProducts = async (filters?: ProductFilters) => {
  return actionHandler(async () => {
    const result = await productService.getAllProducts(filters)
    return result
  })
}

export const getProductById = async (id: number) => {
  return actionHandler(async () => {
    const result = await productService.getProductById(id)
    return result
  })
}

export const getProductsByIds = async (ids: number[]) => {
  return actionHandler(async () => {
    const result = await productService.getProductsByIds(ids)
    return result
  })
}

export const getProductsByNames = async (names: string[]) => {
  return actionHandler(async () => {
    const result = await productService.getProductsByNames(names)
    return result
  })
}

export const createProduct = async (values: CreateProductValues) => {
  return actionHandler(async () => {
    const result = await productService.createProduct(values)
    return result
  })
}

export const updateProduct = async (
  id: number,
  values: UpdateProductValues
) => {
  return actionHandler(async () => {
    const result = await productService.updateProduct(id, values)
    return result
  })
}

export const deleteProduct = async (id: number) => {
  return actionHandler(async () => {
    await productService.deleteProduct(id)
  })
}

export const searchProducts = async (
  query: string,
  filters?: ProductFilters
) => {
  return actionHandler(async () => {
    const result = await productService.searchProducts(query, filters)
    return result
  })
}

export const getRelatedProducts = async (
  currentProductId: number,
  category: CategoryType
) => {
  return actionHandler(async () => {
    const result = await productService.getRelatedProducts(
      currentProductId,
      category
    )
    return result
  })
}
