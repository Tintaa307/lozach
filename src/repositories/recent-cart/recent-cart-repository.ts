import { createClient } from "@/lib/supabase/server"
import { RecentCart, RecentCartWithProduct } from "@/types/recent-cart/types"
import {
  RecentCartCreationException,
  RecentCartFetchException,
} from "@/exceptions/recent-cart/recent-cart-exceptions"

export class RecentCartRepository {
  async createRecentCart(
    productId: number,
    userId: string
  ): Promise<RecentCart> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_recent_cart")
      .insert({
        product_id: productId,
        user_id: userId,
        added_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw new RecentCartCreationException(
        error.message,
        "Error al agregar al carrito reciente"
      )
    }

    return data as RecentCart
  }

  async getRecentCart(
    userId: string,
    limit: number = 3
  ): Promise<RecentCart[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_recent_cart")
      .select("*")
      .eq("user_id", userId)
      .order("added_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new RecentCartFetchException(
        error.message,
        "Error al obtener el carrito reciente"
      )
    }

    return data as RecentCart[]
  }

  async getRecentCartWithProducts(
    userId: string,
    limit: number = 3
  ): Promise<RecentCartWithProduct[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_recent_cart")
      .select(
        `
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          category
        )
      `
      )
      .eq("user_id", userId)
      .order("added_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new RecentCartFetchException(
        error.message,
        "Error al obtener el carrito reciente"
      )
    }

    return data as RecentCartWithProduct[]
  }

  async deleteRecentCart(id: number, userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("user_recent_cart")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      throw new RecentCartCreationException(
        error.message,
        "Error al eliminar del carrito reciente"
      )
    }
  }

  async clearRecentCart(userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("user_recent_cart")
      .delete()
      .eq("user_id", userId)

    if (error) {
      throw new RecentCartCreationException(
        error.message,
        "Error al limpiar el carrito reciente"
      )
    }
  }
}
