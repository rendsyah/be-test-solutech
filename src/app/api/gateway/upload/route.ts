import busboy from 'busboy';
import type { NextRequest } from 'next/server';
import { Readable } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';

import {
  externalFetch,
  handleFetchError,
  normalizeApiResponse,
  withHandler,
} from '@/libs/api/server';
import { HTTP_STATUS } from '@/libs/constants';

export const runtime = 'nodejs';

const handler = async (req: NextRequest) => {
  const abortController = new AbortController();
  return new Promise<Response>((resolve) => {
    const bb = busboy({ headers: Object.fromEntries(req.headers.entries()) });
    const fields: Record<string, string> = {};

    let isFinished = false;

    const finish = (status: number, data: unknown = null, message = 'Success') => {
      if (isFinished) return;
      isFinished = true;
      bb.destroy();
      resolve(Response.json(normalizeApiResponse(status, data as never, message), { status }));
    };

    req.signal.addEventListener('abort', () => {
      abortController.abort();
      nodeStream.unpipe(bb);
      finish(HTTP_STATUS.CLIENT_CLOSED_REQUEST, null, 'Upload cancelled');
    });

    bb.on('field', (name, value) => {
      fields[name] = value;
    });

    bb.on('file', async (_, file, info: busboy.FileInfo) => {
      if (!fields.presign_url) {
        file.resume();
        return finish(HTTP_STATUS.BAD_REQUEST, null, 'Presign URL is required');
      }

      try {
        const uploadRes = await externalFetch(fields.presign_url, {
          signal: abortController.signal,
          method: 'PUT',
          headers: { 'Content-Type': info.mimeType },
          // @ts-expect-error — Node fetch supports web stream as body
          body: Readable.toWeb(file),
          duplex: 'half',
        });

        if (!uploadRes.ok) {
          const error = await handleFetchError(uploadRes);
          return finish(error.status, null, error.message);
        }

        const response = await uploadRes.json();
        finish(HTTP_STATUS.OK, response);
      } catch (err) {
        if (abortController.signal.aborted) return;
        finish(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          null,
          err instanceof Error ? err.message : 'Upload failed',
        );
      }
    });

    bb.on('error', () =>
      finish(HTTP_STATUS.INTERNAL_SERVER_ERROR, null, 'Error parsing form data'),
    );

    const stream = req.body as unknown as NodeReadableStream;
    if (!stream) return finish(HTTP_STATUS.BAD_REQUEST, null, 'No stream found');

    const nodeStream = Readable.fromWeb(stream);
    nodeStream.on('error', () => {
      abortController.abort();
      finish(HTTP_STATUS.INTERNAL_SERVER_ERROR, null, 'Error reading request stream');
    });
    nodeStream.pipe(bb);
  });
};

export const POST = withHandler(handler);
