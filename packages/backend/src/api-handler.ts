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
];

const apiRequestHandler = new ApiRequestHandler(routes);

export const apiHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  callback(null, await apiRequestHandler.handleApiEvent(event));
};
