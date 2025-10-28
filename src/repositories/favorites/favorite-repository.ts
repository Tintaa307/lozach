import { createClient } from "@/lib/supabase/server"
import { Favorite, FavoriteWithProduct } from "@/types/favorites/types"
import {
  FavoriteCreationException,
  FavoriteNotFoundException,
  FavoriteFetchException,
  FavoriteDeletionException,
} from "@/exceptions/favorites/favorite-exceptions"

export class FavoriteRepository {
  async createFavorite(productId: number, userId: string): Promise<Favorite> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        product_id: productId,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw new FavoriteCreationException(
        error.message,
        "Error al agregar a favoritos"
      )
    }

    return data as Favorite
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new FavoriteFetchException(
        error.message,
        "Error al obtener los favoritos"
      )
    }

    return data as Favorite[]
  }

  async getFavoritesWithProducts(
    userId: string
  ): Promise<FavoriteWithProduct[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("favorites")
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
      .order("created_at", { ascending: false })

    if (error) {
      throw new FavoriteFetchException(
        error.message,
        "Error al obtener los favoritos"
      )
    }

    return data as FavoriteWithProduct[]
  }

  async getFavoriteById(id: number, userId: string): Promise<Favorite> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error) {
      throw new FavoriteNotFoundException(
        error.message,
        "Favorito no encontrado"
      )
    }

    if (!data) {
      throw new FavoriteNotFoundException(
        "Favorito no encontrado",
        "Favorito no encontrado"
      )
    }

    return data as Favorite
  }

  async deleteFavorite(id: number, userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      throw new FavoriteDeletionException(
        error.message,
        "Error al eliminar de favoritos"
      )
    }
  }

  async deleteFavoriteByProductId(
    productId: number,
    userId: string
  ): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", userId)

    if (error) {
      throw new FavoriteDeletionException(
        error.message,
        "Error al eliminar de favoritos"
      )
    }
  }

  async isFavorite(productId: number, userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      throw new FavoriteFetchException(
        error.message,
        "Error al verificar si es favorito"
      )
    }

    return !!data
  }
}
