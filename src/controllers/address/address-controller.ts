"use server"

import { actionHandler } from "@/lib/handlers/actionHandler"
import { AddressesService } from "@/services/addresses/addresses-service"

const addressesService = new AddressesService()

export const getAddress = async (userId: string) => {
  return actionHandler(async () => {
    const address = await addressesService.getAddress(userId)

    return address
  })
}
