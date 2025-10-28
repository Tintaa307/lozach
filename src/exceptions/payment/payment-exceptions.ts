import { BaseException } from "../base/base-exceptions"

export class InvalidPreferenceDataException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Revisa la información de los campos",
    fieldErrors: Record<string, string[]> = {}
  ) {
    super(message, 400, userMessage, fieldErrors || undefined)
  }
}

export class PaymentCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear la preferencia"
  ) {
    super(message, 500, userMessage)
  }
}
