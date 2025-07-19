import { NextFunction, Response, Request } from "express"
import { ZodSchema } from "zod"
import { sendBadRequest } from "../utils/responseUtil"

export const validate = (
  schema: ZodSchema<any>,
  source: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse((req as Request & { [key in typeof source]: any })[source])

    if (!result.success) {
      const errors = result.error.errors.map((err) => {
        return `${err.path.join('.')} : ${err.message}`
        
      })

      return sendBadRequest(res, `${errors}`)
    }

    Object.assign(req[source], result.data)
    
    next()
  }
}