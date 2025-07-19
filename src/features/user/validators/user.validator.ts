import { z } from "zod"
import { USER_ROLES } from "../../../constants/constants"

export const getAllUsersQuerySchema = z.object({
  role: z.nativeEnum(USER_ROLES).optional(),
  isActive: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})