class AppError extends Error {
  statusCode: number
  isOperational: boolean
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // Mark operational errors
    Error.captureStackTrace(this, this.constructor) // Capture stack trace
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404)
  }
}

export class ServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500)
  }
}

// Add more error types as needed...
