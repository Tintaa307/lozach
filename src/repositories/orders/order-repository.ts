import {
  OrderCreationException,
  OrderFetchException,
  OrderNotFoundException,
  OrderUpdateException,
} from "@/exceptions/orders/orders-exceptions"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import {
  CreateOrderValues,
  Order,
  UpdateOrderValues,
} from "@/types/order/order"

export class OrderRepository {
  async createOrder(order: CreateOrderValues): Promise<Order> {
    const supabase = await createClient()

    const { error, data } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single()

    if (error) {
      throw new OrderCreationException(error.message, "Error al crear la orden")
    }

    return data as Order
  }

  async getOrderByExternalReference(
    external_reference: string
  ): Promise<Order> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("external_reference", external_reference)
      .single()

    if (error) {
      throw new OrderNotFoundException(error.message, "Orden no encontrada")
    }

    if (!data) {
      throw new OrderNotFoundException(
        "Orden no encontrada",
        "Orden no encontrada"
      )
    }

    return data as Order
  }

  async updateOrder(id: string, order: UpdateOrderValues): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new OrderUpdateException(
        error.message,
        "Error al actualizar la orden"
      )
    }

    return
  }

  async getOrders(userId: string): Promise<Order[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .in("collection_status", ["approved", "cancelled"])
      .order("created_at", { ascending: false })

    console.log(error)

    if (error) {
      throw new OrderFetchException(
        error.message,
        "Error al obtener las órdenes"
      )
    }

    if (!data || data.length === 0) {
      throw new OrderNotFoundException(
        "Órdenes no encontradas",
        "Órdenes no encontradas"
      )
    }

    return data as Order[]
  }
}
