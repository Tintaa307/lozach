import { BaseException } from "../base/base-exceptions"

export class AddressCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear la dirección"
  ) {
    super(message, 500, userMessage)
  }
}

export class AddressFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener la dirección"
  ) {
    super(message, 500, userMessage)
  }
}

export class AddressNotFoundException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Dirección no encontrada"
  ) {
    super(message, 404, userMessage)
  }
}
