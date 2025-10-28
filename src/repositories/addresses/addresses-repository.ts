import { AddressCreationException } from "@/exceptions/addresses/addresses-exceptions"
import { createClient } from "@/lib/supabase/server"
import { CreateAddressValues } from "@/types/address/address"

export class AddressesRepository {
  async createAddress(address: CreateAddressValues): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from("addresses").insert(address)

    if (error) {
      throw new AddressCreationException(
        error.message,
        "Error al crear la dirección"
      )
    }

    return
  }
}
