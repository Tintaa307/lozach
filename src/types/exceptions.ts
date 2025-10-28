export class AppActionException extends Error {
  public statusCode: number
  public userMessage?: string
  public fieldErrors?: Record<string, string[]>

  constructor(
    statusCode: number,
    message: string,
    userMessage?: string,
    fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.userMessage = userMessage
    this.fieldErrors = fieldErrors
  }
}
