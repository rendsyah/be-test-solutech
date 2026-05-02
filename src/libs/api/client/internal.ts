import { buildURL } from '@/libs/utils';
import type { ApiResponse } from '@/types';

import { APP, HTTP_STATUS } from '../../constants';

type Params = Record<string, string | number | boolean>;

type FetchOptions = RequestInit & {
  params?: Params;
};

type UploadResponse = ApiResponse<{ filename: string }>;

type UploadOptions = {
  context: string;
  onProgress?: (percent: number) => void;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
};

const INTERNAL_BASE_URL = '/api/gateway';

const baseInternalAPI = async <T>(
  path: string,
  options?: FetchOptions,
): Promise<ApiResponse<T>> => {
  const { params, ...fetchOptions } = options ?? {};
  const url = buildURL(INTERNAL_BASE_URL, path, params);

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    window.location.href = APP.SESSION_EXPIRED_URL;
    return new Promise(() => {});
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
};

export const internalAPI = {
  get: <T>(path: string, params?: Params) => {
    return baseInternalAPI<T>(path, { params });
  },

  post: <T, B = unknown>(path: string, body?: B) => {
    return baseInternalAPI<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  patch: <T, B = unknown>(path: string, body?: B) => {
    return baseInternalAPI<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  delete: <T>(path: string) => {
    return baseInternalAPI<T>(path, {
      method: 'DELETE',
    });
  },
  stream: (path: string, params?: Params) => {
    const url = buildURL(INTERNAL_BASE_URL, `/stream/${path}`, params);
    window.location.href = url;
  },
  upload: async (file: File, options: UploadOptions) => {
    const { context, onProgress, onSuccess, onError, signal } = options;

    let presignURL = '';
    try {
      const response = await baseInternalAPI<{ url: string }>('/upload/presign', {
        method: 'POST',
        signal,
        body: JSON.stringify({
          context,
          filename: file.name,
          filesize: file.size,
          mimetype: file.type,
        }),
      });
      presignURL = response.data.url;
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Upload failed'));
      return;
    }

    const formData = new FormData();
    formData.append('presign_url', presignURL);
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', buildURL(INTERNAL_BASE_URL, '/upload'), true);

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable || !onProgress) return;
      onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === HTTP_STATUS.UNAUTHORIZED) {
        window.location.href = APP.SESSION_EXPIRED_URL;
        return;
      }

      if (xhr.status >= HTTP_STATUS.BAD_REQUEST) {
        try {
          const err = JSON.parse(xhr.responseText);
          onError?.(new Error(err.message ?? 'Upload failed'));
        } catch {
          onError?.(new Error('Upload failed'));
        }
        return;
      }

      try {
        onSuccess?.(JSON.parse(xhr.responseText));
      } catch {
        onSuccess?.(xhr.responseText as unknown as UploadResponse);
      }
    };

    xhr.onerror = () => onError?.(new Error('Network error'));
    xhr.onabort = () => onError?.(new Error('Upload cancelled'));
    signal?.addEventListener('abort', () => xhr.abort());

    xhr.send(formData);
    return xhr;
  },
};
