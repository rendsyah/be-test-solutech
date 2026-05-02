import { OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';
import { useEffect, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import { FormCol, FormFieldValidation } from '@/components/forms';
import { Button } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';
import { cn } from '@/libs/utils';

import { requestOtpAction, verifyOtpAction } from '../actions';
import type { ForgotPasswordStep, Persist } from '../hooks';
import type { ForgotResponse } from '../types';
import {
  type RequestOtpDto,
  requestOtpSchema,
  verifyOtpSchema,
  type VerifyOtpDto,
} from '../validations';

type VerifyOtpFormProps = {
  persist: Persist | null;
  onPersistToken: (newToken: string, newEmail: string) => void;
  onNext: (step: ForgotPasswordStep) => void;
};

const TIMER_INITIAL = 60;

export const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({
  persist,
  onPersistToken,
  onNext,
}) => {
  const { showAlert } = useAlert();
  const [timer, setTimer] = useState(TIMER_INITIAL);

  const canResend = timer <= 0;

  const { methods, handleSubmit, isPending } = useFormAction<VerifyOtpDto, ForgotResponse>(
    verifyOtpAction,
    verifyOtpSchema,
    {
      transform: (values) => ({
        ...values,
        token: persist?.token ?? '',
      }),
      onSuccess: (response) => {
        onPersistToken(response.token, persist?.email ?? '');
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'OTP verified successfully',
        });
        onNext('reset');
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

  const {
    methods: resendMethods,
    handleSubmit: handleResendSubmit,
    isPending: isResending,
  } = useFormAction<RequestOtpDto, ForgotResponse>(requestOtpAction, requestOtpSchema, {
    onSuccess: (response) => {
      onPersistToken(response.token, persist?.email ?? '');
      showAlert({
        variant: 'modal',
        type: 'success',
        title: 'Success',
        message: 'A new OTP has been sent to your email.',
      });
      setTimer(TIMER_INITIAL);
      methods.reset({ otp: '' });
    },
    onError: (message) => {
      showAlert({
        variant: 'modal',
        type: 'error',
        title: 'Failed',
        message,
      });
    },
  });

  const onResend = () => {
    if (!persist) return;
    resendMethods.setValue('email', persist.email);
    handleResendSubmit();
  };

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (!persist) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="self-center text-center max-w-md mb-10">
          <h1 className="text-xl sm:text-2xl font-semibold">Verify your code</h1>
          <p className="text-sm text-gray-400 mt-2">Please enter the 6-digit code sent to</p>
          <span className="text-sm font-semibold">{persist.email}</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormCol className="col-span-1">
            <FormFieldValidation name="otp" required>
              <Controller
                name="otp"
                control={methods.control}
                render={({ field }) => (
                  <div className="flex justify-center">
                    <OTPInput
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={field.value}
                      onChange={field.onChange}
                      containerClassName="group flex items-center has-disabled:opacity-50 w-full"
                      render={({ slots }) => (
                        <div className="flex justify-between w-full">
                          {slots.map((slot, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                'relative input w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-lg transition-all',
                                slot.isActive && 'border-primary ring-3 ring-primary/10',
                              )}
                            >
                              {slot.char !== null && <div>{slot.char}</div>}
                              {slot.hasFakeCaret && (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                  <div className="h-4 w-px animate-caret-blink bg-gray-700 duration-1000" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                )}
              />
            </FormFieldValidation>
          </FormCol>
        </div>
        <div className="flex flex-col gap-4 mt-auto">
          <Button
            type="submit"
            className="w-full"
            isLoading={isPending}
            disabled={isPending || methods.watch('otp')?.length !== 6}
          >
            {isPending ? 'Loading...' : 'Verify'}
          </Button>
          <div className="text-center flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Didn&apos;t receive the code?</span>
              <button
                type="button"
                className="text-sm font-medium text-primary disabled:opacity-50"
                onClick={onResend}
                disabled={isResending || !canResend}
              >
                Resend
              </button>
            </div>
            <span className="text-sm font-medium">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
