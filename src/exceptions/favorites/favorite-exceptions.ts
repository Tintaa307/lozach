import { BaseException } from "../base/base-exceptions"

export class FavoriteCreationException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al agregar a favoritos"
  ) {
    super(message, 500, userMessage)
  }
}

export class FavoriteNotFoundException extends BaseException {
  constructor(message: string, userMessage: string = "Favorito no encontrado") {
    super(message, 404, userMessage)
  }
}

export class FavoriteFetchException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al obtener los favoritos"
  ) {
    super(message, 500, userMessage)
  }
}

export class FavoriteDeletionException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error al eliminar de favoritos"
  ) {
    super(message, 500, userMessage)
  }
}
