import { successResponse, withApiHandler } from '@/libs/api/server';

export const GET = withApiHandler(async () => {
  return successResponse({ status: 'OK' }, 'Service is healthy');
});
