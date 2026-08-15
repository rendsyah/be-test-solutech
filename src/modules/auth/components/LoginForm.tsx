import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormCol, FormFieldValidation, InputValidation } from '@/components/forms';
import { EyeIcon, EyeSlashIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';

import { loginAction } from '../actions';
import type { LoginResponse } from '../types';
import { loginSchema, type LoginDto } from '../validations';

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined;

  const [showPassword, setShowPassword] = useState(false);

  const { showAlert } = useAlert();
  const { methods, handleSubmit, isPending } = useFormAction<LoginDto, LoginResponse>(
    loginAction,
    loginSchema,
    {
      transform: (values) => ({
        ...values,
        callbackUrl,
      }),
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="self-center text-center max-w-md mb-10">
          <h1 className="text-xl sm:text-2xl font-semibold">Sign in to your account</h1>
          <span className="text-sm text-gray-400">Enter your credentials to continue.</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormCol className="col-span-1">
            <FormFieldValidation name="email" label="Email" required>
              <InputValidation name="email" placeholder="Enter Email" />
            </FormFieldValidation>
          </FormCol>
          <FormCol className="col-span-1">
            <FormFieldValidation name="password" label="Password" required>
              <InputValidation
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                iconPosition="end"
                icon={
                  <div className="cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? (
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
          {isPending ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </FormProvider>
  );
};
