export function formatErrorResponseBody(error: Error): string {
  return JSON.stringify({ message: error.message });
}

export class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    Error.captureStackTrace(this, BadRequestError);
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    Error.captureStackTrace(this, NotFoundError);
  }
}
