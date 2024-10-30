import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { GameApiController } from './lib/api/game-api-controller';
import { GameEntity, GameRecordManager } from './lib/db/game-record-manager';
import { ApiRoute, ApiRequestHandler } from './lib/api/request-handling';
import { PlayerEntity, PlayerRecordManager } from './lib/db/player-record-manager';
import { PlayerApiController } from './lib/api/player-api-controller';
import { GameStateEntity, GameStateRecordManager } from './lib/db/game-state-record-manager';
import { GameStateObjectManager } from './lib/state/game-state-object-manager';

const gameRecordManager = new GameRecordManager(GameEntity);
const gameStateRecordManager = new GameStateRecordManager(GameStateEntity);
const gameStateObjectManager = new GameStateObjectManager();
const gameApiController = new GameApiController(
  gameRecordManager,
  gameStateRecordManager,
  gameStateObjectManager,
);
const playerRecordManager = new PlayerRecordManager(PlayerEntity);
const playerApiController = new PlayerApiController(playerRecordManager);

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
  {
    method: 'GET',
    pattern: /^\/v1\/game\/[a-zA-Z0-9]+\/state$/,
    handler: (apiRequest) => gameApiController.getLatestGameState(apiRequest),
  },
  {
    method: 'POST',
    pattern: /^\/v1\/game\/[a-zA-Z0-9]+\/state$/,
    handler: (apiRequest) => gameApiController.putInitialGameState(apiRequest),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/player\/[a-zA-Z0-9]+$/,
    handler: (apiRequest) => playerApiController.getPlayer(apiRequest),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/player$/,
    handler: (apiRequest) => playerApiController.findPlayers(apiRequest),
  },
  {
    method: 'PATCH',
    pattern: /^\/v1\/player\/[a-zA-Z0-9]+$/,
    handler: (apiRequest) => playerApiController.setFriends(apiRequest),
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
