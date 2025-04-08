"use server"

import { createClient } from "@/lib/supabase/server"

export const createFavorite = async (productId: number) => {
  const supabase = createClient()

  try {
    const { user } = (await (await supabase).auth.getUser()).data

    if (!user) {
      return {
        status: 401,
        message: "Debes iniciar sesión para agregar un producto a favoritos",
      }
    }

    const { error } = await (await supabase).from("favorites").insert({
      product_id: productId,
      user_id: user.id,
    })

    if (error) {
      console.error("Error creating favorite:", error)
      return {
        status: 500,
        message: "Error al agregar el producto a favoritos",
      }
    }

    return {
      status: 200,
      message: "Producto agregado a favoritos",
    }
  } catch (error) {
    console.error("Error creating favorite:", error)
    return {
      status: 500,
      message: "Error al agregar el producto a favoritos",
    }
  }
}

export const getFavorites = async () => {
  const supabase = createClient()

  try {
    const { user } = (await (await supabase).auth.getUser()).data

    if (!user) {
      return {
        status: 401,
        message: "Debes iniciar sesión para ver tus favoritos",
      }
    }

    const { data, error } = await (await supabase)
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching favorites:", error)
      return {
        status: 500,
        message: "Error al obtener los favoritos",
      }
    }

    return {
      status: 200,
      data,
    }
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return {
      status: 500,
      message: "Error al obtener los favoritos",
    }
  }
}

export const getProductsByFavorites = async (ids: number[]) => {
  const supabase = createClient()

  try {
    const { data, error } = await (await supabase)
      .from("products")
      .select("*")
      .in("id", ids)

    if (error) {
      console.error("Error fetching products by favorites:", error)
      return {
        status: 500,
        message: "Error al obtener los productos",
      }
    }

    return {
      status: 200,
      data,
    }
  } catch (error) {
    console.error("Error fetching products by favorites:", error)
    return {
      status: 500,
      message: "Error al obtener los productos",
    }
  }
}
