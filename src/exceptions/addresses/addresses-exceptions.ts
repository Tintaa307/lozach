import { BaseException } from "../base/base-exceptions"

export class AddressCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear la dirección"
  ) {
    super(message, 500, userMessage)
  }
}
