import { BaseException } from "@/exceptions/base/base-exceptions"

export class StorageException extends BaseException {
  constructor(
    message: string,
    userMessage: string = "Error en el almacenamiento de archivos"
  ) {
    super(message, 500, userMessage)
  }
}

export class ImageUploadException extends StorageException {
  constructor(
    message: string,
    userMessage: string = "Error al subir la imagen"
  ) {
    super(message, userMessage)
  }
}

export class ImageDeleteException extends StorageException {
  constructor(
    message: string,
    userMessage: string = "Error al eliminar la imagen"
  ) {
    super(message, userMessage)
  }
}
