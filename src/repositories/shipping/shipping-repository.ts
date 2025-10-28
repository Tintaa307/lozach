import {
  ShippingCreationException,
  ShippingUpdateException,
  ShippingFetchException,
} from "@/exceptions/shipping/shipping-exceptions"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import {
  CreateShippingValues,
  Shipping,
  UpdateShippingValues,
} from "@/types/shipping/shipping"

export class ShippingRepository {
  async createShipping(shipping: CreateShippingValues): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from("shipping").insert(shipping)

    if (error) {
      throw new ShippingCreationException(
        error.message,
        "Error al crear el envío"
      )
    }

    return
  }

  async getShippingByOrderId(orderId: string): Promise<Shipping> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("shipping")
      .select("*")
      .eq("order_id", orderId)
      .single()

    if (error) {
      throw new ShippingFetchException(
        error.message,
        "Error al obtener el envío"
      )
    }

    if (!data) {
      throw new ShippingFetchException(
        "Envío no encontrado",
        "Envío no encontrado"
      )
    }

    return data as Shipping
  }

  async updateShipping(
    orderId: string,
    shipping: UpdateShippingValues
  ): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("shipping")
      .update({
        ...shipping,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId)

    if (error)
      throw new ShippingUpdateException(
        error.message,
        "Error al actualizar el envío"
      )

    return
  }
}
