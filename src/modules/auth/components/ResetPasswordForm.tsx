import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormCol, FormFieldValidation, InputValidation } from '@/components/forms';
import { EyeIcon, EyeSlashIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';

import { resetPasswordAction } from '../actions';
import { AUTH_ROUTES } from '../constants';
import type { Persist } from '../hooks';
import { resetPasswordSchema, type ResetPasswordDto } from '../validations';

type ResetPasswordFormProps = {
  persist: Persist | null;
};

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ persist }) => {
  const { showAlert } = useAlert();
  const router = useRouter();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { methods, handleSubmit, isPending } = useFormAction<ResetPasswordDto>(
    resetPasswordAction,
    resetPasswordSchema,
    {
      omit: ['confirm_password'],
      transform: (values) => ({
        ...values,
        token: persist?.token ?? '',
      }),
      onSuccess: () => {
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'Password reset successfully. Please login with your new password',
        });
        router.push(AUTH_ROUTES.root);
      },
      onError: (message) => {
        showAlert({
          variant: 'modal',
          type: 'error',
          title: 'Failed',
          message,
        });
      },
    },
  );

  if (!persist) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="self-center text-center max-w-md mb-10">
          <h1 className="text-xl sm:text-2xl font-semibold">Reset Password</h1>
          <p className="text-sm text-gray-400 mt-2">Enter your new password below.</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormCol className="col-span-1">
            <FormFieldValidation name="new_password" label="New Password" required>
              <InputValidation
                name="new_password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter New Password"
                iconPosition="end"
                icon={
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeSlashIcon className="size-5" />
                    )}
                  </div>
                }
              />
            </FormFieldValidation>
          </FormCol>

          <FormCol className="col-span-1">
            <FormFieldValidation name="confirm_password" label="Confirm Password" required>
              <InputValidation
                name="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                iconPosition="end"
                icon={
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeSlashIcon className="size-5" />
                    )}
                  </div>
                }
              />
            </FormFieldValidation>
          </FormCol>
        </div>
        <Button type="submit" className="mt-auto" isLoading={isPending} disabled={isPending}>
          {isPending ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </FormProvider>
  );
};
