import Link from 'next/link';
import { FormProvider } from 'react-hook-form';

import { FormCol, FormFieldValidation, InputValidation } from '@/components/forms';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';

import { requestOtpAction } from '../actions';
import { AUTH_ROUTES } from '../constants';
import type { ForgotPasswordStep } from '../hooks';
import type { ForgotResponse } from '../types';
import { requestOtpSchema, type RequestOtpDto } from '../validations';

type ForgotPasswordFormProps = {
  onPersistToken: (newToken: string, newEmail: string) => void;
  onNext: (nextStep: ForgotPasswordStep) => void;
};

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onPersistToken,
  onNext,
}) => {
  const { showAlert } = useAlert();
  const { methods, handleSubmit, isPending } = useFormAction<RequestOtpDto, ForgotResponse>(
    requestOtpAction,
    requestOtpSchema,
    {
      onSuccess: (response) => {
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'OTP has been sent to your email',
        });
        onPersistToken(response.token, methods.getValues('email'));
        onNext('verify');
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="self-center text-center max-w-md mb-10">
          <h1 className="text-xl sm:text-2xl font-semibold">Forgot Password</h1>
          <span className="text-sm text-gray-400">
            Enter your email address to receive an OTP code.
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormCol className="col-span-1">
            <FormFieldValidation name="email" label="Email Address" required>
              <InputValidation name="email" placeholder="Enter Email Address" />
            </FormFieldValidation>
          </FormCol>
        </div>
        <div className="flex flex-col gap-4 mt-auto">
          <Button type="submit" isLoading={isPending} disabled={isPending}>
            {isPending ? 'Loading...' : 'Send'}
          </Button>
          <Link
            href={AUTH_ROUTES.root}
            className="flex items-center justify-center gap-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeftIcon className="size-3" />
            Back to sign in
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};
