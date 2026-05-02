'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { AlertModal, Toast } from '@/components/ui';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

type AlertVariant = 'modal' | 'toast';

type AlertState = {
  variant: AlertVariant;
  type: AlertType;
  title: string;
  message?: string;
} | null;

type AlertContextType = {
  showAlert: (state: Exclude<AlertState, null>) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>(null);

  const showAlert = useCallback((state: Exclude<AlertState, null>) => {
    if (state.variant === 'toast') {
      Toast({ ...state, position: 'bottom-right' });
      return;
    }
    setAlert(state);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert?.variant === 'modal' && <AlertModal {...alert} onClose={hideAlert} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};
