import {
  ForbiddenException,
  ValidationException,
  NotFoundException,
  UnauthorizedException,
  InternalServerException,
} from "@/exceptions/base/base-exceptions"
import {
  StorageException,
  ImageUploadException,
  ImageDeleteException,
} from "@/exceptions/storage/storage-exceptions"

/**
 * Maps custom exceptions to HTTP status codes.
 * @param error - The error object to map.
 * @returns The corresponding HTTP status code.
 */
export function getHttpStatusCode(error: unknown): number {
  if (error instanceof NotFoundException) {
    return 404
  } else if (error instanceof ValidationException) {
    return 400
  } else if (error instanceof UnauthorizedException) {
    return 401
  } else if (error instanceof ForbiddenException) {
    return 403
  } else if (
    error instanceof InternalServerException ||
    error instanceof StorageException ||
    error instanceof ImageUploadException ||
    error instanceof ImageDeleteException
  ) {
    return 500
  }

  return 500 // Default to internal server error for unknown exceptions
}
