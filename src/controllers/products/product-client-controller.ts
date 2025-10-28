"use client"

import { createClient } from "@/lib/supabase/client"
import { ActionResponse } from "@/lib/handlers/actionHandler"

interface Product {
  id: number
  name: string
  price: number
  cover_image_url: string
  category: string
}

export async function getProductsClientAction(filters?: {
  search?: string
}): Promise<ActionResponse<Product[]>> {
  try {
    const supabase = createClient()

    let query = supabase.from("products").select("*")

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      return {
        success: false,
        data: null,
        message: "Error al obtener los productos",
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        data: null,
        message: "No se encontraron productos",
      }
    }

    return {
      success: true,
      data: data as Product[],
      message: "Productos obtenidos exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener los productos"
    return {
      success: false,
      data: null,
      message: errorMessage,
    }
  }
}

export async function getProductsByNamesClientAction(
  names: string[]
): Promise<ActionResponse<Product[]>> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, cover_image_url, category")
      .in("name", names)
      .limit(6)

    if (error) {
      return {
        success: false,
        data: null,
        message: "Error al obtener los productos",
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        data: null,
        message: "Productos no encontrados",
      }
    }

    return {
      success: true,
      data: data as Product[],
      message: "Productos obtenidos exitosamente",
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener los productos"
    return {
      success: false,
      data: null,
      message: errorMessage,
    }
  }
}
