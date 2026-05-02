import { z } from 'zod';

export const menusUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  permissions: z.array(z.string()).optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  sort: z.coerce.number().min(1, 'Sort is required'),
  parent_id: z.string().nullable(),
});

export type MenusUpdateDto = z.infer<typeof menusUpdateSchema>;
