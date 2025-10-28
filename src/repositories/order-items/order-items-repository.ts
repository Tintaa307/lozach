import {
  OrderItemsCreationException,
  OrderItemsFetchException,
} from "@/exceptions/order-items/order-items-exceptions"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import {
  CreateOrderItemValues,
  OrderItem,
} from "@/types/order-items/order-items"

export class OrderItemsRepository {
  async createOrderItem(orderItem: CreateOrderItemValues): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from("order_items").insert(orderItem)

    if (error) {
      throw new OrderItemsCreationException(
        error.message,
        "Error al crear el item de la orden"
      )
    }

    return
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)

    if (error) {
      throw new OrderItemsFetchException(
        error.message,
        "Error al obtener los items de la orden"
      )
    }

    if (!data) {
      throw new OrderItemsFetchException(
        "Items de la orden no encontrados",
        "Items de la orden no encontrados"
      )
    }

    return data as OrderItem[]
  }
}
