import { z } from 'zod';

export const rolesCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  menus: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
});

export const rolesUpdateSchema = rolesCreateSchema.extend({
  id: z.string().optional(),
  status: z.coerce.number(),
});

export const rolesFormSchema = rolesCreateSchema.extend({
  id: z.string().optional(),
  status: z.coerce.number().optional(),
});

export type RolesCreateDto = z.infer<typeof rolesCreateSchema>;
export type RolesUpdateDto = z.infer<typeof rolesUpdateSchema>;
export type RolesFormDto = z.infer<typeof rolesFormSchema>;
