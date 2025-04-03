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
    return {
      status: 500,
      message: "Error interno del servidor",
    }
  }
}
