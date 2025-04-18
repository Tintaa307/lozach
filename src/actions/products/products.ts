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

export const getProductsByIdArray = async (ids: number[]) => {
  const supabase = createClient()

  try {
    if (!ids || ids.length === 0) {
      return {
        status: 400,
        message: "ID de producto no proporcionado",
      }
    }

    const { data, error } = await (await supabase)
      .from("products")
      .select("name, id")
      .in("id", ids)

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

export const getProductsByNames = async (names: string[]) => {
  const supabase = createClient()

  try {
    if (!names || names.length === 0) {
      return {
        status: 400,
        message: "Nombres de producto no proporcionados",
      }
    }

    const { data, error } = await (await supabase)
      .from("products")
      .select("id, name, price, image_url, category")
      .in("name", names)
      .limit(6)

    if (error) {
      return {
        status: 500,
        message: error.message,
      }
    }

    if (!data || data.length === 0) {
      return {
        status: 404,
        message: "Productos no encontrados",
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
