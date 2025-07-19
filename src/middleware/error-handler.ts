import type { Request, Response, NextFunction } from "express"

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)

    // Handle invalid JSON
    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON payload",
        errors: [
          {
            path: "body",
            message: "Malformed JSON in request body",
          },
        ],
      })
    }
    
  const customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong, please try again later",
    errors: err.errors || [],
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    customError.statusCode = 400
    customError.message = "Validation Error"
    customError.errors = Object.values(err.errors).map((item: any) => ({
      path: item.path,
      message: item.message,
    }))
  }

  // Handle Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    customError.statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    customError.message = `Duplicate value entered for ${field} field`
    customError.errors = [
      {
        path: field,
        message: `Duplicate value: ${err.keyValue[field]}`,
      },
    ]
  }

  // Handle Mongoose cast error
  if (err.name === "CastError") {
    customError.statusCode = 400
    customError.message = `Invalid ${err.path}: ${err.value}`
    customError.errors = [
      {
        path: err.path,
        message: `Invalid value: ${err.value}`,
      },
    ]
  }

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message
  })
}

export default errorHandler