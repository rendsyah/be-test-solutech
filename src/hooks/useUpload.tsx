'use client';

import { useState, useRef, useEffect } from 'react';

import { useAlert } from '@/contexts';
import { internalAPI } from '@/libs/api/client';
import { UPLOAD_CONFIG } from '@/libs/constants';

export const useUpload = () => {
  const { showAlert } = useAlert();

  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const validate = (file: File, maxSize: number = UPLOAD_CONFIG.maxSize) => {
    const maxSizeMB = maxSize * 1024 * 1024;

    if (file.size > maxSizeMB) {
      showAlert({
        variant: 'toast',
        type: 'error',
        title: 'Failed',
        message: `File size must be less than ${maxSize}MB`,
      });
      return false;
    }

    if (!UPLOAD_CONFIG.acceptedTypes.includes(file.type)) {
      showAlert({
        variant: 'toast',
        type: 'error',
        title: 'Failed',
        message: 'File type not supported',
      });
      return false;
    }

    return true;
  };

  const onUpload = (file: File, context: string) => {
    setUploading(true);
    setCompleted(false);
    setPercent(0);
    setData(null);
    setError(null);

    abortControllerRef.current = new AbortController();

    internalAPI.upload(file, {
      context,
      signal: abortControllerRef.current.signal,
      onProgress: setPercent,
      onSuccess: (res) => {
        setUploading(false);
        setCompleted(true);
        setData(res?.data.filename);
      },
      onError: (err) => {
        setUploading(false);
        setError(err);
      },
    });
  };

  const onCancel = () => {
    abortControllerRef.current?.abort();
    setUploading(false);
  };

  useEffect(() => {
    if (error) {
      showAlert({
        variant: 'toast',
        type: 'error',
        title: 'Failed',
        message: error.message,
      });
    }
  }, [error, showAlert]);

  useEffect(() => {
    return () => onCancel();
  }, []);

  return {
    uploading,
    completed,
    percent,
    data,
    error,
    validate,
    onUpload,
    onCancel,
  };
};
