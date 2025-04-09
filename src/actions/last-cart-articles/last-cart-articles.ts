"use server"

import { createClient } from "@/lib/supabase/server"

export const getLastCartArticles = async () => {
  const supabase = await createClient()

  try {
    const { user } = (await (await supabase).auth.getUser()).data

    if (!user) return

    const { data, error } = await supabase
      .from("user_recent_cart")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching recent cart articles:", error.message)
      return
    }

    if (!data) return

    return {
      status: 200,
      data,
    }
  } catch (error) {
    console.error("Error fetching recent cart articles:", error)
    return {
      status: 500,
      error: "Error fetching recent cart articles",
    }
  }
}
