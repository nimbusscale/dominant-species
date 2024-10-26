import { APIGatewayProxyEvent } from 'aws-lambda';
import { ensureDefined } from '../util';
import { CognitoIdTokenJwt } from 'api-types/src/auth';
import { jwtDecode } from 'jwt-decode';
import { ApiResponseType } from 'api-types/src/request-response';
import { BadRequestError, NotFoundError } from '../../error';
import { StatusCodes } from 'http-status-codes';

interface QueryParameters {
  username?: string;
}

export interface ApiRequest {
  path: string;
  httpMethod: string;
  queryStringParameters: QueryParameters | null;
  username: string | null;
}

export interface ApiResponse {
  statusCode: number;
  body: string;
}

function getUsernameFromIdToken(token: string): string {
  const decodedToken: CognitoIdTokenJwt = jwtDecode(token);
  return ensureDefined(decodedToken['cognito:username']);
}

export function apiGwEventToApiRequest(apiGwEvent: APIGatewayProxyEvent): ApiRequest {
  return {
    httpMethod: apiGwEvent.httpMethod,
    path: apiGwEvent.path,
    queryStringParameters: apiGwEvent.queryStringParameters,
    username: getUsernameFromIdToken(ensureDefined(apiGwEvent.headers['Authorization'])),
  };
}

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PATCH';
  pattern: RegExp;
  handler: (apiRequest: ApiRequest) => Promise<ApiResponseType>;
}

export function findRoute(apiRequest: ApiRequest, routes: ApiRoute[]): ApiRoute | undefined {
  return routes.find(
    (route) => route.method === apiRequest.httpMethod && route.pattern.test(apiRequest.path),
  );
}

export function formatErrorResponseBody(error: Error): string {
  return JSON.stringify({ message: error.message });
}

export function createResponseFromError(error: Error): ApiResponse {
  if (error instanceof BadRequestError) {
    return { statusCode: StatusCodes.BAD_REQUEST, body: formatErrorResponseBody(error) };
  } else if (error instanceof NotFoundError) {
    return { statusCode: StatusCodes.NOT_FOUND, body: formatErrorResponseBody(error) };
  } else {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: formatErrorResponseBody(error as Error),
    };
  }
}

export async function handleApiEvent(
  apiGwEvent: APIGatewayProxyEvent,
  routes: ApiRoute[],
): Promise<ApiResponse> {
  let apiResponse: ApiResponse;
  try {
    const apiRequest = apiGwEventToApiRequest(apiGwEvent);
    const route = findRoute(apiRequest, routes);
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
    apiResponse = createResponseFromError(error as Error);
  }
  return apiResponse;
}
