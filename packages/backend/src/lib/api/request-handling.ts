import {APIGatewayProxyEvent} from "aws-lambda";
import {ensureDefined} from "../util";
import {CognitoIdTokenJwt} from "api-types/src/auth";
import {jwtDecode} from "jwt-decode";
import {ApiResponseType} from "api-types/src/request-response";
import {BadRequestError, NotFoundError} from "../../error";
import {StatusCodes} from "http-status-codes";

interface QueryParameters {
  username?: string;
}

export interface ApiEvent {
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

export function apiGwEventToApiEvent(apiGwEvent: APIGatewayProxyEvent): ApiEvent {
  return {
    httpMethod: apiGwEvent.httpMethod,
    path: apiGwEvent.path,
    queryStringParameters: apiGwEvent.queryStringParameters,
    username: getUsernameFromIdToken(ensureDefined(apiGwEvent.headers['Authorization'])),
  };
}

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PATCH',
  pattern: RegExp,
  handler: (apiEvent: ApiEvent) => Promise<ApiResponseType>;
}

export function findRoute(apiEvent: ApiEvent, routes: ApiRoute[]): ApiRoute | undefined {
  return routes.find(
    (route) => route.method === apiEvent.httpMethod && route.pattern.test(apiEvent.path),
  )
}

export function formatErrorResponseBody(error: Error): string {
  return JSON.stringify({message: error.message});
}

export function createResponseFromError(error: Error): ApiResponse {
  if (error instanceof BadRequestError) {
    return {statusCode: StatusCodes.BAD_REQUEST, body: formatErrorResponseBody(error)};
  } else if (error instanceof NotFoundError) {
    return {statusCode: StatusCodes.NOT_FOUND, body: formatErrorResponseBody(error)};
  } else {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: formatErrorResponseBody(error as Error),
    };
  }
}

export async function handleApiEvent(apiGwEvent: APIGatewayProxyEvent, routes: ApiRoute[]): Promise<ApiResponse> {
  let apiResponse: ApiResponse;
  try {
    const apiEvent = apiGwEventToApiEvent(apiGwEvent)
    const route = findRoute(apiEvent, routes)
    if (route) {
      apiResponse = {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(await route.handler(apiEvent)),
      };
    } else {
      throw new NotFoundError();
    }
  } catch (error) {
    console.error(error);
    apiResponse = createResponseFromError(error as Error);
  }
  return apiResponse
}
