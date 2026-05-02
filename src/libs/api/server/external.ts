import axios from 'axios';
import { randomUUID } from 'crypto';
import { headers } from 'next/headers';

import { ENV } from '@/libs/env';
import { getSession } from '@/libs/session';
import { buildURL } from '@/libs/utils';

const EXTERNAL_BASE_URL = `${ENV.API_BASE_URL}/api/v1`;

export const getExternalHeaders = async () => {
  const [session, headersList] = await Promise.all([getSession(), headers()]);

  const internalHeaders: Record<string, string> = {
    'X-Request-ID': randomUUID(),
    'X-Forwarded-For': headersList.get('x-forwarded-for') || '',
    'User-Agent': headersList.get('user-agent') || '',
  };

  if (session.token) {
    internalHeaders.Authorization = `Bearer ${session.token}`;
  }

  return internalHeaders;
};

export const externalAPI = axios.create({
  baseURL: EXTERNAL_BASE_URL,
});

externalAPI.interceptors.request.use(async (config) => {
  const externalHeaders = await getExternalHeaders();
  Object.entries(externalHeaders).forEach(([key, value]) => {
    config.headers[key] = value;
  });

  return config;
});

externalAPI.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

type ExternalFetchOptions = RequestInit & {
  baseURL?: string;
};

export const externalFetch = async (path: string, options?: ExternalFetchOptions) => {
  const { baseURL = EXTERNAL_BASE_URL, ...fetchOptions } = options ?? {};
  const externalHeaders = await getExternalHeaders();
  const url = buildURL(baseURL, path);

  const reqHeaders = new Headers(fetchOptions.headers);
  Object.entries(externalHeaders).forEach(([key, value]) => {
    reqHeaders.set(key, value);
  });

  return fetch(url, { ...fetchOptions, headers: reqHeaders });
};
