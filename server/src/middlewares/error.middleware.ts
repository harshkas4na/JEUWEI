import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }
  
  console.error('Unhandled error:', err);
  return sendError(res, 'Internal server error', 500);
};