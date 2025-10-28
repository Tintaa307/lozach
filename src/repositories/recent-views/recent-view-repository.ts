import { createClient } from "@/lib/supabase/server"
import { RecentView, RecentViewWithProduct } from "@/types/recent-views/types"
import {
  RecentViewCreationException,
  RecentViewFetchException,
} from "@/exceptions/recent-views/recent-view-exceptions"

export class RecentViewRepository {
  async createRecentView(
    productId: number,
    userId: string
  ): Promise<RecentView> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_recent_views")
      .insert({
        product_id: productId,
        user_id: userId,
        viewed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw new RecentViewCreationException(
        error.message,
        "Error al registrar la vista"
      )
    }

    return data as RecentView
  }

  async getRecentViews(
    userId: string,
    limit: number = 3
  ): Promise<RecentView[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_recent_views")
      .select("*")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new RecentViewFetchException(
        error.message,
        "Error al obtener las vistas recientes"
      )
    }

    return data as RecentView[]
  }

  async getRecentViewsWithProducts(
    userId: string,
    limit: number = 3
  ): Promise<RecentViewWithProduct[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("user_recent_views")
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
      .order("viewed_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new RecentViewFetchException(
        error.message,
        "Error al obtener las vistas recientes"
      )
    }

    return data as RecentViewWithProduct[]
  }

  async deleteRecentView(id: number, userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("user_recent_views")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      throw new RecentViewCreationException(
        error.message,
        "Error al eliminar la vista reciente"
      )
    }
  }

  async clearRecentViews(userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("user_recent_views")
      .delete()
      .eq("user_id", userId)

    if (error) {
      throw new RecentViewCreationException(
        error.message,
        "Error al limpiar las vistas recientes"
      )
    }
  }
}
