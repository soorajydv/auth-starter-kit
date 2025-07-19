import { z } from "zod";

export const createProfileValidator = z.object({
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  address: z.string().min(1, "Address is required"),
  phone: z.string({
    required_error: "Phone is required",
    invalid_type_error: "Phone must be a string"
  }).regex(/^\+?[0-9]{7,15}$/, "Phone must be a valid number"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender must be male, female, or other" }),
  }),
  timezone: z.string().min(5).optional(),
});

export const updateProfileValidator = z.object({
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }).optional(),
  address: z.string().min(1, "Address is required").optional(),
  phone: z.string().min(1, "Phone is required").optional(),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender must be male, female, or other" }),
  }).optional(),
  timezone: z.string().optional(),
});