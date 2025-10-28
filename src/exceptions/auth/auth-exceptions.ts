import { BaseException } from "../base/base-exceptions"

export class AuthCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear el usuario"
  ) {
    super(message, 500, userMessage)
  }
}

export class AuthLoginException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al iniciar sesión"
  ) {
    super(message, 401, userMessage)
  }
}

export class AuthVerificationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error en la verificación"
  ) {
    super(message, 400, userMessage)
  }
}

export class AuthMissingUserException extends BaseException {
  constructor(message: string, userMessage: string = "Usuario no encontrado") {
    super(message, 404, userMessage)
  }
}

export class AuthUnauthorizedException extends BaseException {
  constructor(message: string, userMessage: string = "No autorizado") {
    super(message, 401, userMessage)
  }
}
