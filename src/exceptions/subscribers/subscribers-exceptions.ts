import { BaseException } from "../base/base-exceptions"

export class SubscriberCreationException extends BaseException {
  constructor(
    message: string = "Subscriber creation error",
    userMessage: string = "Error al crear el suscriptor"
  ) {
    super(message, 500, userMessage)
  }
}
