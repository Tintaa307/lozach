import { BaseException } from "../base/base-exceptions"

export class OrderCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear la orden"
  ) {
    super(message, 500, userMessage)
  }
}

export class OrderNotFoundException extends BaseException {
  constructor(message: string, userMessage: string = "Orden no encontrada") {
    super(message, 404, userMessage)
  }
}

export class OrderUpdateException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al actualizar la orden"
  ) {
    super(message, 500, userMessage)
  }
}

export class OrderFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener las órdenes"
  ) {
    super(message, 500, userMessage)
  }
}
