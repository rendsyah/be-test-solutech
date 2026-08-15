import { HTTP_STATUS } from '../constants';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: string[] = [],
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string) {
    return new AppError(HTTP_STATUS.BAD_REQUEST, message);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = 'Not found') {
    return new AppError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string = 'Conflict') {
    return new AppError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = 'An unexpected error occurred') {
    return new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}
