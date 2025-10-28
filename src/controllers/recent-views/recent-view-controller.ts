"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { RecentViewService } from "@/services/recent-views/recent-view-service"

const recentViewService = new RecentViewService()

export const createRecentView = async (productId: number, userId: string) => {
  return actionHandler(async () => {
    return await recentViewService.createRecentView(productId, userId)
  })
}

export const getRecentViews = async (userId: string, limit: number = 3) => {
  return actionHandler(async () => {
    return await recentViewService.getRecentViews(userId, limit)
  })
}

export const getRecentViewsWithProducts = async (
  userId: string,
  limit: number = 3
) => {
  return actionHandler(async () => {
    return await recentViewService.getRecentViewsWithProducts(userId, limit)
  })
}

export const deleteRecentView = async (id: number, userId: string) => {
  return actionHandler(async () => {
    return await recentViewService.deleteRecentView(id, userId)
  })
}

export const clearRecentViews = async (userId: string) => {
  return actionHandler(async () => {
    return await recentViewService.clearRecentViews(userId)
  })
}
