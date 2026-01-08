import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { APIResponse } from '../types/restaurant';
import { ErrorCode } from '../types/enums';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode | string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Không tìm thấy') {
    super(404, ErrorCode.NOT_FOUND, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, ErrorCode.VALIDATION_ERROR, message);
  }
}

function handleZodError(error: ZodError): { statusCode: number; code: ErrorCode; message: string } {
  const issues = error.issues || [];
  const message = issues.map((e) => `${String(e.path.join('.'))}: ${e.message}`).join(', ');
  return { statusCode: 400, code: ErrorCode.VALIDATION_ERROR, message };
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`${err.code}: ${err.message}`);
  } else {
    logger.error('Unhandled error:', err);
  }

  if (err instanceof ZodError) {
    const { statusCode, code, message } = handleZodError(err);
    const response: APIResponse<null> = {
      success: false,
      data: null,
      error: { code, message },
    };
    res.status(statusCode).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response: APIResponse<null> = {
      success: false,
      data: null,
      error: { code: err.code, message: err.message },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  const response: APIResponse<null> = {
    success: false,
    data: null,
    error: { code: ErrorCode.INTERNAL_ERROR, message: 'Đã xảy ra lỗi' },
  };
  res.status(500).json(response);
}

export function notFoundHandler(_req: Request, res: Response): void {
  const response: APIResponse<null> = {
    success: false,
    data: null,
    error: { code: ErrorCode.NOT_FOUND, message: 'Endpoint không tồn tại' },
  };
  res.status(404).json(response);
}
