import { z } from 'zod';

export const permissionsCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  key: z.string().min(1, 'Key is required'),
  description: z.string().min(1, 'Description is required'),
});

export const permissionsFormSchema = permissionsCreateSchema.extend({
  id: z.string().optional(),
});

export type PermissionsCreateDto = z.infer<typeof permissionsCreateSchema>;
export type PermissionsFormDto = z.infer<typeof permissionsFormSchema>;
