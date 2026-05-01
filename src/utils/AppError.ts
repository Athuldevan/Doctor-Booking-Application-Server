
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CAST_ERROR: "CAST_ERROR",
  DUPLICATE_KEY: "DUPLICATE_KEY",
  JWT_INVALID: "JWT_INVALID",
  JWT_EXPIRED: "JWT_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT: "RATE_LIMIT",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  FILE_UPLOAD_ERROR: "FILE_UPLOAD_ERROR",
  TIMEOUT: "TIMEOUT",
  SERVER_ERROR: "SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
} as const;

export class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  code: string;

  constructor(
    message: string,
    statusCode: number,
    code: string = ErrorCodes.SERVER_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string): AppError {
    return new AppError(message, 400, code || ErrorCodes.BAD_REQUEST);
  }

  static unauthorized(message: string, code?: string): AppError {
    return new AppError(message, 401, code || ErrorCodes.UNAUTHORIZED);
  }

  static forbidden(message: string, code?: string): AppError {
    return new AppError(message, 403, code || ErrorCodes.FORBIDDEN);
  }

  static notFound(message: string, code?: string): AppError {
    return new AppError(message, 404, code || ErrorCodes.NOT_FOUND);
  }

  static conflict(message: string, code?: string): AppError {
    return new AppError(message, 409, code || ErrorCodes.CONFLICT);
  }

  static validationError(message: string): AppError {
    return new AppError(message, 400, ErrorCodes.VALIDATION_ERROR);
  }

  static databaseError(message: string): AppError {
    return new AppError(message, 500, ErrorCodes.DATABASE_ERROR);
  }

  static serverError(message: string): AppError {
    return new AppError(message, 500, ErrorCodes.SERVER_ERROR);
  }
}
