'use client';

import { Suspense } from 'react';

import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { VerifyOtpForm } from '../components/VerifyOtpForm';
import { useAuthForgot } from '../hooks';

export const ForgotPasswordViewPage: React.FC = () => {
  const { step, persist, onPersistToken, onNext } = useAuthForgot();

  const RenderForm = () => {
    switch (step) {
      case 'request':
        return <ForgotPasswordForm onPersistToken={onPersistToken} onNext={onNext} />;
      case 'reset':
        return <ResetPasswordForm persist={persist} />;
      case 'verify':
        return <VerifyOtpForm persist={persist} onPersistToken={onPersistToken} onNext={onNext} />;
      default:
        return null;
    }
  };

  return <Suspense fallback={null}>{RenderForm()}</Suspense>;
};
