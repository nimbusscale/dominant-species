import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { GameApiController } from './lib/api/game';
import { GameEntity, GameRecordManager } from './lib/db/game';
import {ApiRequest, handleApiEvent, ApiRoute} from "./lib/api/request-handling";

const gameRecordManager = new GameRecordManager(GameEntity);
const gameApiController = new GameApiController(gameRecordManager);

const routes: ApiRoute[] = [
  {
    method: 'GET',
    pattern: /^\/v1\/game$/,
    handler: (apiRequest: ApiRequest) => gameApiController.getGameForUser(apiRequest),
  },
];

export const apiHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  callback(null, handleApiEvent(event, routes));
};
