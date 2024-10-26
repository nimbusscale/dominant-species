import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { GameApiController } from './lib/api/game';
import { GameEntity, GameRecordManager } from './lib/db/game';
import { ApiRoute, ApiRequestHandler } from './lib/api/request-handling';

const gameRecordManager = new GameRecordManager(GameEntity);
const gameApiController = new GameApiController(gameRecordManager);

const routes: ApiRoute[] = [
  {
    method: 'GET',
    pattern: /^\/v1\/game$/,
    handler: (apiRequest) => gameApiController.getGamesForUser(apiRequest),
  },
  {
    method: 'POST',
    pattern: /^\/v1\/game$/,
    handler: (apiRequest) => gameApiController.addGame(apiRequest),
  },
  {
    method: 'PATCH',
    pattern: /^\/v1\/game\/[a-zA-Z0-9]+$/,
    handler: (apiRequest) => gameApiController.completeGame(apiRequest),
  },
];

const apiRequestHandler = new ApiRequestHandler(routes);

export const apiHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  callback(null, await apiRequestHandler.handleApiEvent(event));
};
