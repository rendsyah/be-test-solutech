import { z } from 'zod';

const deviceSchema = z.object({
  firebase_id: z.string(),
  device_browser: z.string(),
  device_browser_version: z.string(),
  device_imei: z.string(),
  device_model: z.string(),
  device_type: z.string(),
  device_vendor: z.string(),
  device_os: z.string(),
  device_os_version: z.string(),
  device_platform: z.string(),
  user_agent: z.string(),
  app_version: z.string(),
});

export const loginSchema = z.object({
  user: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  device: deviceSchema.optional(),
  callbackUrl: z.string().optional(),
});

export const requestOtpSchema = z.object({
  email: z.email('Invalid email address'),
});

export const verifyOtpSchema = z.object({
  otp: z.string(),
  token: z.string().optional(),
});

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
    token: z.string().optional(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type LoginDto = z.infer<typeof loginSchema>;
export type RequestOtpDto = z.infer<typeof requestOtpSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
