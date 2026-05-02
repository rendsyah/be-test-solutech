'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useLayoutEffect, useRef, useTransition } from 'react';
import type { DefaultValues, FieldValues, Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { $ZodType } from 'zod/v4/core';

import { APP, HTTP_STATUS } from '@/libs/constants';
import type { ApiResponse } from '@/types';

type Action<TInput, R> = (
  state: ApiResponse<R> | null,
  values: TInput,
) => Promise<ApiResponse<R> | null>;

export const useFormAction = <T extends FieldValues, R = unknown, TPayload = T>(
  action: Action<TPayload, R>,
  schema: $ZodType<T, FieldValues>,
  options?: {
    defaultValues?: DefaultValues<T>;
    transform?: (values: T) => TPayload;
    omit?: readonly (keyof T)[];
    onSuccess?: (data: R) => void;
    onError?: (message: string) => void;
  },
) => {
  const [state, serverAction, isPending] = useActionState(action, null);
  const [, startTransition] = useTransition();

  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  const methods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: options?.defaultValues,
  });

  const omitFields = <T extends object, K extends keyof T>(
    obj: T,
    keys: readonly K[],
  ): Omit<T, K> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
    ) as Omit<T, K>;
  };

  const handleSubmit = methods.handleSubmit((values) => {
    let payload: unknown = values;

    if (options?.omit?.length) {
      payload = omitFields(values, options.omit);
    }

    if (options?.transform) {
      payload = options.transform(payload as T);
    }

    startTransition(() => serverAction(payload as TPayload));
  });

  useLayoutEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });

  useEffect(() => {
    if (!state) return;
    if (state.status === HTTP_STATUS.UNAUTHORIZED) {
      window.location.href = APP.SESSION_EXPIRED_URL;
      return;
    }

    if (state.success) {
      onSuccessRef.current?.(state.data);
    } else {
      onErrorRef.current?.(state.message);
    }
  }, [state]);

  return { methods, handleSubmit, state, isPending };
};
