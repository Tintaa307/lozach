import { BaseException } from "../base/base-exceptions"

export class RecentViewCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al registrar la vista"
  ) {
    super(message, 500, userMessage)
  }
}

export class RecentViewFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener las vistas recientes"
  ) {
    super(message, 500, userMessage)
  }
}
