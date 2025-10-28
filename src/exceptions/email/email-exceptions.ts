import { BaseException } from "../base/base-exceptions"

export class EmailSendingException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al enviar el email"
  ) {
    super(message, 500, userMessage)
  }
}
