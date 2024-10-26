import { APIGatewayProxyEvent } from 'aws-lambda';
import { ensureDefined } from '../util';
import { CognitoIdTokenJwt } from 'api-types/src/auth';
import { jwtDecode } from 'jwt-decode';
import { ApiResponseType } from 'api-types/src/request-response';
import { BadRequestError, NotFoundError } from '../error';
import { StatusCodes } from 'http-status-codes';

interface QueryParameters {
  username?: string;
}

export interface ApiRequest {
  path: string;
  httpMethod: string;
  queryStringParameters: QueryParameters | null;
  username: string | null;
  body: string | null;
}

export interface ApiResponse {
  statusCode: number;
  body: string;
}

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PATCH';
  pattern: RegExp;
  handler: (apiRequest: ApiRequest) => Promise<ApiResponseType>;
}

export class ApiRequestHandler {
  constructor(private routes: ApiRoute[]) {}

  private getUsernameFromIdToken(token: string): string {
    const decodedToken: CognitoIdTokenJwt = jwtDecode(token);
    return ensureDefined(decodedToken['cognito:username']);
  }

  private apiGwEventToApiRequest(apiGwEvent: APIGatewayProxyEvent): ApiRequest {
    return {
      httpMethod: apiGwEvent.httpMethod,
      path: apiGwEvent.path,
      queryStringParameters: apiGwEvent.queryStringParameters,
      username: this.getUsernameFromIdToken(ensureDefined(apiGwEvent.headers['Authorization'])),
      body: apiGwEvent.body
    };
  }

  private findRoute(apiRequest: ApiRequest): ApiRoute | undefined {
    return this.routes.find(
      (route) => route.method === apiRequest.httpMethod && route.pattern.test(apiRequest.path),
    );
  }

  private formatErrorResponseBody(error: Error): string {
    return JSON.stringify({ message: error.message });
  }

  private createResponseFromError(error: Error): ApiResponse {
    if (error instanceof BadRequestError) {
      return { statusCode: StatusCodes.BAD_REQUEST, body: this.formatErrorResponseBody(error) };
    } else if (error instanceof NotFoundError) {
      return { statusCode: StatusCodes.NOT_FOUND, body: this.formatErrorResponseBody(error) };
    } else {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: this.formatErrorResponseBody(error),
      };
    }
  }

  async handleApiEvent(apiGwEvent: APIGatewayProxyEvent): Promise<ApiResponse> {
    let apiResponse: ApiResponse;
    try {
      const apiRequest = this.apiGwEventToApiRequest(apiGwEvent);
      const route = this.findRoute(apiRequest);
      if (route) {
        apiResponse = {
          statusCode: StatusCodes.OK,
          body: JSON.stringify(await route.handler(apiRequest)),
        };
      } else {
        throw new NotFoundError();
      }
    } catch (error) {
      console.error(error);
      apiResponse = this.createResponseFromError(error as Error);
    }
    return apiResponse;
  }
}
