"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { RecentCartService } from "@/services/recent-cart/recent-cart-service"

const recentCartService = new RecentCartService()

export const createRecentCart = async (productId: number, userId: string) => {
  return actionHandler(async () => {
    return await recentCartService.createRecentCart(productId, userId)
  })
}

export const getRecentCart = async (userId: string, limit: number = 3) => {
  return actionHandler(async () => {
    return await recentCartService.getRecentCart(userId, limit)
  })
}

export const getRecentCartWithProducts = async (
  userId: string,
  limit: number = 3
) => {
  return actionHandler(async () => {
    return await recentCartService.getRecentCartWithProducts(userId, limit)
  })
}

export const deleteRecentCart = async (id: number, userId: string) => {
  return actionHandler(async () => {
    return await recentCartService.deleteRecentCart(id, userId)
  })
}

export const clearRecentCart = async (userId: string) => {
  return actionHandler(async () => {
    return await recentCartService.clearRecentCart(userId)
  })
}
