import { ProductRepository } from "@/repositories/products/product-repository"
import { Product } from "@/types/types"
import {
  CreateProductValues,
  ProductFilters,
  UpdateProductValues,
  CategoryType,
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

  async createProduct(values: CreateProductValues): Promise<Product> {
    return await this.productRepository.createProduct(values)
  }

  async updateProduct(
    id: number,
    values: UpdateProductValues
  ): Promise<Product> {
    return await this.productRepository.updateProduct(id, values)
  }

  async deleteProduct(id: number): Promise<void> {
    return await this.productRepository.deleteProduct(id)
  }

  async searchProducts(
    query: string,
    filters?: ProductFilters
  ): Promise<Product[]> {
    return await this.productRepository.searchProducts(query, filters)
  }

  async getRelatedProducts(
    currentProductId: number,
    category: CategoryType,
    limit: number = 4
  ): Promise<Product[]> {
    const products = await this.productRepository.getAllProducts({
      category,
      search: undefined,
    })
    
    return products
      .filter((product) => product.id !== currentProductId)
      .slice(0, limit)
  }
}
