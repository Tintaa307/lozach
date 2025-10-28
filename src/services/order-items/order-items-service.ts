import { OrderItemsRepository } from "@/repositories/order-items/order-items-repository"
import {
  CreateOrderItemValues,
  OrderItem,
} from "@/types/order-items/order-items"

export class OrderItemsService {
  private readonly orderItemsRepository: OrderItemsRepository

  constructor(orderItemsRepository?: OrderItemsRepository) {
    this.orderItemsRepository =
      orderItemsRepository || new OrderItemsRepository()
  }

  async createOrderItem(orderItem: CreateOrderItemValues): Promise<void> {
    return await this.orderItemsRepository.createOrderItem(orderItem)
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return await this.orderItemsRepository.getOrderItemsByOrderId(orderId)
  }
}
