import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email().trim().toLowerCase();
export const nonEmptyString = z.string().trim().min(1);
