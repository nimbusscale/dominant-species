import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { GameApiController } from './lib/api/game';
import { GameEntity, GameRecordManager } from './lib/db/game';
import { BaseApiEvent } from './lib/api/schema/api-event';
import { getUsernameFromIdToken } from './lib/api/auth/auth';
import { ensureDefined } from './lib/util';

const gameRecordManager = new GameRecordManager(GameEntity);
const gameApiController = new GameApiController(gameRecordManager);

export const apiHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  const getApiEvent: BaseApiEvent = {
    path: event.path,
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters,
    username: getUsernameFromIdToken(ensureDefined(event.headers['Authorization'])),
  };
  const result = await gameApiController.getGameForUser(getApiEvent);
  callback(null, result);
};
