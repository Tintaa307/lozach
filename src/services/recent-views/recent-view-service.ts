import { RecentViewRepository } from "@/repositories/recent-views/recent-view-repository"
import { RecentView, RecentViewWithProduct } from "@/types/recent-views/types"

export class RecentViewService {
  private recentViewRepository: RecentViewRepository

  constructor() {
    this.recentViewRepository = new RecentViewRepository()
  }

  async createRecentView(
    productId: number,
    userId: string
  ): Promise<RecentView> {
    return await this.recentViewRepository.createRecentView(productId, userId)
  }

  async getRecentViews(
    userId: string,
    limit: number = 3
  ): Promise<RecentView[]> {
    return await this.recentViewRepository.getRecentViews(userId, limit)
  }

  async getRecentViewsWithProducts(
    userId: string,
    limit: number = 3
  ): Promise<RecentViewWithProduct[]> {
    return await this.recentViewRepository.getRecentViewsWithProducts(
      userId,
      limit
    )
  }

  async deleteRecentView(id: number, userId: string): Promise<void> {
    return await this.recentViewRepository.deleteRecentView(id, userId)
  }

  async clearRecentViews(userId: string): Promise<void> {
    return await this.recentViewRepository.clearRecentViews(userId)
  }
}
