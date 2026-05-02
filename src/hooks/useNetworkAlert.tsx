'use client';

import { useEffect, useRef } from 'react';

import { useAlert } from '@/contexts/AlertContext';
import { useNetwork } from '@/contexts/NetworkContext';

export const useNetworkAlert = () => {
  const { isOnline } = useNetwork();
  const { showAlert } = useAlert();
  const prevIsOnlineRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevIsOnlineRef.current === null) {
      prevIsOnlineRef.current = isOnline;
      return;
    }

    if (prevIsOnlineRef.current === isOnline) return;

    prevIsOnlineRef.current = isOnline;

    showAlert({
      variant: 'toast',
      type: isOnline ? 'success' : 'error',
      title: isOnline ? 'Connected' : 'Offline',
      message: isOnline
        ? 'Your network connection has been restored.'
        : 'Please check your connection and try again.',
    });
  }, [isOnline, showAlert]);
};
