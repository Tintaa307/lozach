import { redirect } from "next/navigation"
import { getUser } from "@/controllers/auth/auth-controller"
import { getFavoritesWithProducts } from "@/controllers/favorites/favorite-controller"
import { getRecentViewsWithProducts } from "@/controllers/recent-views/recent-view-controller"
import { getRecentCartWithProducts } from "@/controllers/recent-cart/recent-cart-controller"
import ProfileClient from "./ProfileClient"

export default async function UserProfile() {
  // Get user data
  const userResult = await getUser()

  if (!userResult.success || !userResult.data) {
    return redirect("/login")
  }

  const user = userResult.data

  // Get user's favorites with products
  const favoritesResult = await getFavoritesWithProducts(user.id)
  const favorites = favoritesResult.success ? favoritesResult.data || [] : []

  // Get recent views with products
  const recentViewsResult = await getRecentViewsWithProducts(user.id)
  const lastViewProducts = recentViewsResult.success
    ? recentViewsResult.data || []
    : []

  // Get recent cart with products
  const recentCartResult = await getRecentCartWithProducts(user.id)
  const lastCartProducts = recentCartResult.success
    ? recentCartResult.data || []
    : []

  return (
    <ProfileClient
      user={user}
      favorites={favorites}
      lastViewProducts={lastViewProducts}
      lastCartProducts={lastCartProducts}
    />
  )
}
