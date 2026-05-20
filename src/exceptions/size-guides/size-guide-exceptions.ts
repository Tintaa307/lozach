import { BaseException } from "../base/base-exceptions"

export class SizeGuideNotFoundException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Guía de talles no encontrada"
  ) {
    super(message, 404, userMessage)
  }
}

export class SizeGuideCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear la guía de talles"
  ) {
    super(message, 500, userMessage)
  }
}

export class SizeGuideUpdateException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al actualizar la guía de talles"
  ) {
    super(message, 500, userMessage)
  }
}

export class SizeGuideDeletionException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al eliminar la guía de talles"
  ) {
    super(message, 500, userMessage)
  }
}

export class SizeGuideFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener las guías de talles"
  ) {
    super(message, 500, userMessage)
  }
}
