import { z } from 'zod';

export const objectIdRegex = /^[a-f\d]{24}$/i;
export const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const objectIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/, 'Invalid id fromat'),
});