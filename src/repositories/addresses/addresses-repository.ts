import {
  AddressCreationException,
  AddressFetchException,
} from "@/exceptions/addresses/addresses-exceptions"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@/lib/supabase/admin-client"
import { Address, CreateAddressValues } from "@/types/address/address"

export class AddressesRepository {
  async createAddress(address: CreateAddressValues): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase.from("addresses").insert(address)

    if (error) {
      throw new AddressCreationException(
        error.message,
        "Error al crear la dirección"
      )
    }

    return
  }

  async getAddress(userId: string): Promise<Address | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new AddressFetchException(
        error.message,
        "Error al obtener la dirección"
      )
    }

    return (data as Address | null) ?? null
  }
}
