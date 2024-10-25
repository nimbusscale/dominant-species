import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { GameApiController } from './lib/api/game';
import { GameEntity, GameRecordManager } from './lib/db/game';
import { BaseApiEvent } from './lib/api/api-event';

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
    username: event.requestContext.identity.user,
  };
  const result = await gameApiController.getGameForUser(getApiEvent);
  console.log(result);
  callback(null, result);
};
