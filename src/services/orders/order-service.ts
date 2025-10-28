import { OrderRepository } from "@/repositories/orders/order-repository"
import {
  CreateOrderValues,
  Order,
  UpdateOrderValues,
} from "@/types/order/order"

export class OrderService {
  private readonly orderRepository: OrderRepository

  constructor(orderRepository?: OrderRepository) {
    this.orderRepository = orderRepository || new OrderRepository()
  }

  async createOrder(order: CreateOrderValues): Promise<Order> {
    const orderData = await this.orderRepository.createOrder(order)

    return orderData as Order
  }

  async getOrderByExternalReference(
    external_reference: string
  ): Promise<Order> {
    const orderData = await this.orderRepository.getOrderByExternalReference(
      external_reference
    )

    return orderData
  }

  async updateOrder(id: string, order: UpdateOrderValues): Promise<void> {
    return await this.orderRepository.updateOrder(id, order)
  }
}
