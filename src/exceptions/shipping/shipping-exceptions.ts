import { BaseException } from "../base/base-exceptions"

export class ShippingCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear el envío"
  ) {
    super(message, 500, userMessage)
  }
}

export class ShippingFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener el envío"
  ) {
    super(message, 500, userMessage)
  }
}

export class ShippingUpdateException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al actualizar el envío"
  ) {
    super(message, 500, userMessage)
  }
}
