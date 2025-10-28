import {
  AddressCreationException,
  AddressFetchException,
  AddressNotFoundException,
} from "@/exceptions/addresses/addresses-exceptions"
import { createClient } from "@/lib/supabase/server"
import { Address, CreateAddressValues } from "@/types/address/address"

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

  async getAddress(userId: string): Promise<Address> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error) {
      throw new AddressFetchException(
        error.message,
        "Error al obtener la dirección"
      )
    }

    if (!data) {
      throw new AddressNotFoundException(
        "Dirección no encontrada",
        "Dirección no encontrada"
      )
    }

    return data as Address
  }
}
