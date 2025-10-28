import { BaseException } from "../base/base-exceptions"

export class RecentCartCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al agregar al carrito reciente"
  ) {
    super(message, 500, userMessage)
  }
}

export class RecentCartFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener el carrito reciente"
  ) {
    super(message, 500, userMessage)
  }
}
