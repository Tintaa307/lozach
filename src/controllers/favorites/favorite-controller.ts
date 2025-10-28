"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { FavoriteService } from "@/services/favorites/favorite-service"

const favoriteService = new FavoriteService()

export const createFavorite = async (productId: number, userId: string) => {
  return actionHandler(async () => {
    return await favoriteService.createFavorite(productId, userId)
  })
}

export const getFavorites = async (userId: string) => {
  return actionHandler(async () => {
    return await favoriteService.getFavorites(userId)
  })
}

export const getFavoritesWithProducts = async (userId: string) => {
  return actionHandler(async () => {
    return await favoriteService.getFavoritesWithProducts(userId)
  })
}

export const getFavoriteById = async (id: number, userId: string) => {
  return actionHandler(async () => {
    return await favoriteService.getFavoriteById(id, userId)
  })
}

export const deleteFavorite = async (id: number, userId: string) => {
  return actionHandler(async () => {
    return await favoriteService.deleteFavorite(id, userId)
  })
}

export const deleteFavoriteByProductId = async (
  productId: number,
  userId: string
) => {
  return actionHandler(async () => {
    return await favoriteService.deleteFavoriteByProductId(productId, userId)
  })
}

export const isFavorite = async (productId: number, userId: string) => {
  return actionHandler(async () => {
    return await favoriteService.isFavorite(productId, userId)
  })
}
