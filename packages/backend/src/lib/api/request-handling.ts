import { APIGatewayProxyEvent } from 'aws-lambda';
import { ensureDefined } from '../util';
import { CognitoIdTokenJwt } from 'api-types/src/auth';
import { jwtDecode } from 'jwt-decode';
import { createResponseFromError, NotFoundError } from '../error';
import { StatusCodes } from 'http-status-codes';
import { ApiRequest, ApiResponse, ApiRoute } from 'api-types/src/request-response';

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
      body: apiGwEvent.body,
    };
  }

  private findRoute(apiRequest: ApiRequest): ApiRoute | undefined {
    return this.routes.find(
      (route) => route.method === apiRequest.httpMethod && route.pattern.test(apiRequest.path),
    );
  }

  async handleApiEvent(apiGwEvent: APIGatewayProxyEvent): Promise<ApiResponse> {
    let apiResponse: ApiResponse;
    try {
      const apiRequest = this.apiGwEventToApiRequest(apiGwEvent);
      const route = this.findRoute(apiRequest);
      if (route) {
        apiResponse = {
          statusCode: StatusCodes.OK,
          body: JSON.stringify((await route.handler(apiRequest)) ?? {}),
          headers: {
            'Content-Type': 'application/json',
            // not the best around, but since I don't have a dev env, and I'd be allowing localhost, not a big difference.
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
          },
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
}
