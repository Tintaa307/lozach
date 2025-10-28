import { FavoriteRepository } from "@/repositories/favorites/favorite-repository"
import { Favorite, FavoriteWithProduct } from "@/types/favorites/types"

export class FavoriteService {
  private favoriteRepository: FavoriteRepository

  constructor() {
    this.favoriteRepository = new FavoriteRepository()
  }

  async createFavorite(productId: number, userId: string): Promise<Favorite> {
    return await this.favoriteRepository.createFavorite(productId, userId)
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return await this.favoriteRepository.getFavorites(userId)
  }

  async getFavoritesWithProducts(
    userId: string
  ): Promise<FavoriteWithProduct[]> {
    return await this.favoriteRepository.getFavoritesWithProducts(userId)
  }

  async getFavoriteById(id: number, userId: string): Promise<Favorite> {
    return await this.favoriteRepository.getFavoriteById(id, userId)
  }

  async deleteFavorite(id: number, userId: string): Promise<void> {
    return await this.favoriteRepository.deleteFavorite(id, userId)
  }

  async deleteFavoriteByProductId(
    productId: number,
    userId: string
  ): Promise<void> {
    return await this.favoriteRepository.deleteFavoriteByProductId(
      productId,
      userId
    )
  }

  async isFavorite(productId: number, userId: string): Promise<boolean> {
    return await this.favoriteRepository.isFavorite(productId, userId)
  }
}
