import { z } from 'zod';

const baseSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
});

export const usersCreateSchema = baseSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roles: z.array(z.string()).min(1, 'Roles is required'),
});

export const usersUpdateSchema = baseSchema.extend({
  id: z.string().optional(),
  status: z.coerce.number(),
  roles: z.array(z.string()).min(1, 'Roles is required'),
});

export const usersFormSchema = baseSchema
  .extend({
    id: z.string().optional(),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    roles: z.array(z.string()).optional(),
    status: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.roles || data.roles.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['roles'],
        message: 'Roles is required',
      });
    }

    const isCreate = !data.id;
    if (!isCreate) return;

    if (!data.password || data.password.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password is required',
      });
    } else if (data.password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must be at least 8 characters',
      });
    }

    if (!data.confirm_password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'Confirm Password is required',
      });
    } else if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'Passwords do not match',
      });
    }
  });

export type UsersCreateDto = z.infer<typeof usersCreateSchema>;
export type UsersUpdateDto = z.infer<typeof usersUpdateSchema>;
export type UsersFormDto = z.infer<typeof usersFormSchema>;
