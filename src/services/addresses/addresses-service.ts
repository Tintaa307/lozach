import { AddressesRepository } from "@/repositories/addresses/addresses-repository"
import { CreateAddressValues } from "@/types/address/address"

export class AddressesService {
  private readonly addressesRepository: AddressesRepository

  constructor(addressesRepository?: AddressesRepository) {
    this.addressesRepository = addressesRepository || new AddressesRepository()
  }

  async createAddress(address: CreateAddressValues): Promise<void> {
    return await this.addressesRepository.createAddress(address)
  }
}
