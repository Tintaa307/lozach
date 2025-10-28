import { BaseException } from "../base/base-exceptions"

export class ProductNotFoundException extends BaseException {
  constructor(message: string, userMessage: string = "Producto no encontrado") {
    super(message, 404, userMessage)
  }
}

export class ProductCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al crear el producto"
  ) {
    super(message, 500, userMessage)
  }
}

export class ProductUpdateException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al actualizar el producto"
  ) {
    super(message, 500, userMessage)
  }
}

export class ProductDeletionException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al eliminar el producto"
  ) {
    super(message, 500, userMessage)
  }
}

export class ProductFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener los productos"
  ) {
    super(message, 500, userMessage)
  }
}
