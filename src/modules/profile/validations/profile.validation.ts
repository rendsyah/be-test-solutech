import { z } from 'zod';

export const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  image: z.string(),
});

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Old password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type UpdateAccountDto = z.infer<typeof updateAccountSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
