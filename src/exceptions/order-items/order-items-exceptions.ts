import { BaseException } from "../base/base-exceptions"

export class OrderItemsCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear el item de la orden"
  ) {
    super(message, 500, userMessage)
  }
}

export class OrderItemsFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener los items de la orden"
  ) {
    super(message, 500, userMessage)
  }
}
