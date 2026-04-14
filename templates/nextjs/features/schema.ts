import { z } from 'zod';

export const __feature__Schema = z.object({
  name: z.string().min(1).max(255),
});

export type __Feature__FormData = z.infer<typeof __feature__Schema>;
