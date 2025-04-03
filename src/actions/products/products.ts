"use server"

import { createClient } from "@/lib/supabase/server"

export const getProducts = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await (await supabase).from("products").select("*")

    if (error) {
      return {
        status: 500,
        message: error.message,
      }
    }

    if (!data) {
      return {
        status: 404,
        message: "No se encontraron productos",
      }
    }

    return {
      status: 200,
      data,
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Error interno del servidor",
    }
  }
}

export const getProductById = async (id: string) => {
  const supabase = createClient()

  try {
    if (!id) {
      return {
        status: 400,
        message: "ID de producto no proporcionado",
      }
    }

    const { data, error } = await (await supabase)
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return {
        status: 500,
        message: error.message,
      }
    }

    if (!data || data.length === 0) {
      return {
        status: 404,
        message: "Producto no encontrado",
      }
    }

    return {
      status: 200,
      data: data,
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Error interno del servidor",
    }
  }
}
