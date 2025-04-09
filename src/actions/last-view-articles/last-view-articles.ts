"use server"

import { createClient } from "@/lib/supabase/server"

export const getLastViewArticles = async () => {
  const supabase = await createClient()

  try {
    const { user } = (await supabase.auth.getUser()).data

    if (!user) return

    const { data, error } = await supabase
      .from("user_recent_views")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching recent views:", error.message)
      return
    }

    if (!data) return

    return {
      status: 200,
      data,
    }
  } catch (error) {
    console.error("Error fetching recent views:", error)
    return {
      status: 500,
      error: "Error fetching recent views",
    }
  }
}
