import { ApiResponse } from "api-types/src/request-response";
import {StatusCodes} from "http-status-codes";


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


export function createResponseFromError(error: Error): ApiResponse {
    if (error instanceof BadRequestError) {
      return { statusCode: StatusCodes.BAD_REQUEST, body: JSON.stringify({ message: error.message }) };
    } else if (error instanceof NotFoundError) {
      return { statusCode: StatusCodes.NOT_FOUND, body: JSON.stringify({ message: error.message }) };
    } else {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({ message: error.message }),
      };
    }
}
