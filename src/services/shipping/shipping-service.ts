import { ShippingRepository } from "@/repositories/shipping/shipping-repository"
import {
  CreateShippingValues,
  Shipping,
  UpdateShippingValues,
} from "@/types/shipping/shipping"

export class ShippingService {
  private readonly shippingRepository: ShippingRepository

  constructor(shippingRepository?: ShippingRepository) {
    this.shippingRepository = shippingRepository || new ShippingRepository()
  }

  async createShipping(shipping: CreateShippingValues): Promise<void> {
    return await this.shippingRepository.createShipping(shipping)
  }

  async getShippingByOrderId(orderId: string): Promise<Shipping> {
    return await this.shippingRepository.getShippingByOrderId(orderId)
  }

  async updateShipping(
    orderId: string,
    shipping: UpdateShippingValues
  ): Promise<void> {
    return await this.shippingRepository.updateShipping(orderId, shipping)
  }
}
