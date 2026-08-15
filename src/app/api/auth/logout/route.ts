import { successResponse, withApiHandler } from '@/libs/api/server';
import { deleteSession } from '@/libs/session';

export const POST = withApiHandler(async () => {
  await deleteSession();
  return successResponse(null, 'Logout successful');
});
