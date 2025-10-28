import { RecentCartRepository } from "@/repositories/recent-cart/recent-cart-repository"
import { RecentCart, RecentCartWithProduct } from "@/types/recent-cart/types"

export class RecentCartService {
  private recentCartRepository: RecentCartRepository

  constructor() {
    this.recentCartRepository = new RecentCartRepository()
  }

  async createRecentCart(
    productId: number,
    userId: string
  ): Promise<RecentCart> {
    return await this.recentCartRepository.createRecentCart(productId, userId)
  }

  async getRecentCart(
    userId: string,
    limit: number = 3
  ): Promise<RecentCart[]> {
    return await this.recentCartRepository.getRecentCart(userId, limit)
  }

  async getRecentCartWithProducts(
    userId: string,
    limit: number = 3
  ): Promise<RecentCartWithProduct[]> {
    return await this.recentCartRepository.getRecentCartWithProducts(
      userId,
      limit
    )
  }

  async deleteRecentCart(id: number, userId: string): Promise<void> {
    return await this.recentCartRepository.deleteRecentCart(id, userId)
  }

  async clearRecentCart(userId: string): Promise<void> {
    return await this.recentCartRepository.clearRecentCart(userId)
  }
}
