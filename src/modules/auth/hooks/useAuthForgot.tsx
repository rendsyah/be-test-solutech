import { useCallback, useState } from 'react';

export type ForgotPasswordStep = 'request' | 'verify' | 'reset';

export type Persist = {
  token: string;
  email: string;
};

export const useAuthForgot = () => {
  const [step, setStep] = useState<ForgotPasswordStep>('request');
  const [persist, setPersist] = useState<Persist | null>(null);

  const onPersistToken = useCallback((newToken: string, newEmail: string) => {
    setPersist({
      token: newToken,
      email: newEmail,
    });
  }, []);

  const onNext = useCallback((nextStep: ForgotPasswordStep) => {
    setStep(nextStep);
  }, []);

  return {
    step,
    persist,
    onPersistToken,
    onNext,
  };
};
