import { ProductRepository } from "@/repositories/products/product-repository"
import { Product } from "@/types/types"
import {
  CreateProductValues,
  ProductFilters,
  UpdateProductValues,
} from "@/types/products/types"

export class ProductService {
  private readonly productRepository: ProductRepository

  constructor(productRepository?: ProductRepository) {
    this.productRepository = productRepository || new ProductRepository()
  }

  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    return await this.productRepository.getAllProducts(filters)
  }

  async getProductById(id: number): Promise<Product> {
    return await this.productRepository.getProductById(id)
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    return await this.productRepository.getProductsByIds(ids)
  }

  async getProductsByNames(names: string[]): Promise<Product[]> {
    return await this.productRepository.getProductsByNames(names)
  }

  async createProduct(
    values: CreateProductValues,
    userId?: string
  ): Promise<Product> {
    return await this.productRepository.createProduct(values, userId)
  }

  async updateProduct(
    id: number,
    values: UpdateProductValues,
    userId?: string
  ): Promise<Product> {
    return await this.productRepository.updateProduct(id, values, userId)
  }

  async deleteProduct(id: number, userId?: string): Promise<void> {
    return await this.productRepository.deleteProduct(id, userId)
  }
}
