import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { GameApiController } from './lib/api/game';
import { GameEntity, GameRecordManager } from './lib/db/game';
import { BaseApiEvent } from './lib/api/schema/api-event';
import { getUsernameFromIdToken } from './lib/api/auth/auth';
import { ensureDefined } from './lib/util';
import { ApiResponse } from './lib/api/schema/api-response';
import { BadRequestError, formatErrorResponseBody, NotFoundError } from './error';
import { StatusCodes } from 'http-status-codes';

const gameRecordManager = new GameRecordManager(GameEntity);
const gameApiController = new GameApiController(gameRecordManager);

const routes = [
  {
    method: 'GET',
    pattern: /^\/v1\/game$/,
    handler: (apiEvent: BaseApiEvent) => gameApiController.getGameForUser(apiEvent),
  },
];

export const apiHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  let result: ApiResponse;

  try {
    const apiEvent: BaseApiEvent = {
      httpMethod: event.httpMethod,
      path: event.path,
      queryStringParameters: event.queryStringParameters,
      username: getUsernameFromIdToken(ensureDefined(event.headers['Authorization'])),
    };
    const route = routes.find(
      (route) => route.method === apiEvent.httpMethod && route.pattern.test(apiEvent.path),
    );
    if (route) {
      result = {
        statusCode: StatusCodes.OK,
        body: JSON.stringify(await route.handler(apiEvent)),
      };
    } else {
      throw new NotFoundError();
    }
  } catch (e) {
    console.error(e);
    if (e instanceof BadRequestError) {
      result = { statusCode: StatusCodes.BAD_REQUEST, body: formatErrorResponseBody(e) };
    } else if (e instanceof NotFoundError) {
      result = { statusCode: StatusCodes.NOT_FOUND, body: formatErrorResponseBody(e) };
    } else {
      result = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: formatErrorResponseBody(e as Error),
      };
    }
  }

  callback(null, result);
};
