export class BaseException extends Error {
  public readonly statusCode: number
  public readonly userMessage: string
  public readonly fieldErrors?: Record<string, string[]>

  constructor(
    message: string,
    statusCode: number = 500,
    userMessage: string = "Error interno del servidor",
    fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.userMessage = userMessage
    this.fieldErrors = fieldErrors
  }
}

export class ValidationException extends BaseException {
  constructor(
    message: string,
    fieldErrors?: Record<string, string[]>,
    userMessage: string = "Error de validación en los campos"
  ) {
    super(message, 400, userMessage, fieldErrors)
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string, userMessage: string = "Recurso no encontrado") {
    super(message, 404, userMessage)
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string, userMessage: string = "No autorizado") {
    super(message, 401, userMessage)
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string, userMessage: string = "Acceso denegado") {
    super(message, 403, userMessage)
  }
}

export class ConflictException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Conflicto con el recurso"
  ) {
    super(message, 409, userMessage)
  }
}

export class InternalServerException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error interno del servidor"
  ) {
    super(message, 500, userMessage)
  }
}
