'use client';

import { Suspense } from 'react';

import { LoginForm } from '../components';

export const LoginViewPage: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
};
