import { expect, jest, it, describe } from '@jest/globals';
import { Game, GameCollection } from 'api-types/src/game';
import { GameState } from 'api-types/src/game-state';
import {GameApiController} from "../../../lib/api/game-api-controller";
import {GameRecordManager} from "../../../lib/db/game-record-manager";
import {GameStateEntityType, GameStateRecordManager} from "../../../lib/db/game-state-record-manager";
import {GameStateObjectManager} from "../../../lib/state/game-state-object-manager";
import {ApiRequest} from "../../../lib/api/request-handling";
import {BadRequestError, NotFoundError} from "../../../lib/error";

describe('GameApiController', () => {
  let gameApiController: GameApiController;
  let gameRecordManager: jest.Mocked<GameRecordManager>;
  let gameStateRecordManager: jest.Mocked<GameStateRecordManager>;
  let gameStateObjectManager: jest.Mocked<GameStateObjectManager>;
  let apiRequest: jest.Mocked<ApiRequest>;

  beforeEach(() => {
    gameRecordManager = {
      addGame: jest.fn(),
      getGamesForPlayer: jest.fn(),
      completeGame: jest.fn(),
    } as any;

    gameStateRecordManager = {
      addInitialGameState: jest.fn(),
      getLatestGameStateRecord: jest.fn(),
    } as any;

    gameStateObjectManager = {
      putGameState: jest.fn(),
      getGameState: jest.fn(),
    } as any;

    gameApiController = new GameApiController(
      gameRecordManager,
      gameStateRecordManager,
      gameStateObjectManager
    );

    apiRequest = {
      body: '',
      queryStringParameters: {},
      path: '',
    } as any;
  });

  describe('addGame', () => {
    it('should add a game when body is provided', async () => {
      const game: Game = {} as Game;
      apiRequest.body = JSON.stringify(game);
      await gameApiController.addGame(apiRequest);
      expect(gameRecordManager.addGame).toHaveBeenCalledWith(game);
    });

    it('should throw BadRequestError if body is missing', async () => {
      apiRequest.body = null;
      await expect(gameApiController.addGame(apiRequest)).rejects.toThrow(BadRequestError);
    });
  });

  describe('getGamesForUser', () => {
    it('should return games for the user when username is provided', async () => {
      const games: GameCollection = { games: [] };
      apiRequest.queryStringParameters = { username: 'testUser' };
      gameRecordManager.getGamesForPlayer.mockResolvedValue(games.games);

      const result = await gameApiController.getGamesForUser(apiRequest);
      expect(result).toEqual(games);
    });

    it('should throw BadRequestError if username is missing', async () => {
      apiRequest.queryStringParameters = {};
      await expect(gameApiController.getGamesForUser(apiRequest)).rejects.toThrow(BadRequestError);
    });
  });

  describe('completeGame', () => {
    it('should complete the game if complete is set to true in the body', async () => {
      const gameId = '12345';
      apiRequest.path = `/v1/game/${gameId}`;
      apiRequest.body = JSON.stringify({ complete: true });

      await expect(gameApiController.completeGame(apiRequest)).resolves.not.toThrow();
    });

    it('should throw BadRequestError if complete is not set to true in the body', async () => {
      apiRequest.path = '/v1/game/12345';
      apiRequest.body = JSON.stringify({ complete: false });

      await expect(gameApiController.completeGame(apiRequest)).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if body is missing', async () => {
      apiRequest.path = '/v1/game/12345';
      apiRequest.body = null;

      await expect(gameApiController.completeGame(apiRequest)).rejects.toThrow(BadRequestError);
    });
  });

  describe('putInitialGameState', () => {
    it('should add the initial game state when body is provided', async () => {
      const gameState: GameState = {} as GameState;
      apiRequest.body = JSON.stringify(gameState);

      await gameApiController.putInitialGameState(apiRequest);
      expect(gameStateRecordManager.addInitialGameState).toHaveBeenCalledWith(gameState);
      expect(gameStateObjectManager.putGameState).toHaveBeenCalledWith(gameState);
    });

    it('should throw BadRequestError if body is missing', async () => {
      apiRequest.body = null;

      await expect(gameApiController.putInitialGameState(apiRequest)).rejects.toThrow(BadRequestError);
    });
  });

  describe('getLatestGameState', () => {
    it('should return the latest game state if it exists', async () => {
      const gameId = '12345';
      const patchId = 1;
      const latestGameState = {} as GameState;
      apiRequest.path = `/v1/game/${gameId}`;

      gameStateRecordManager.getLatestGameStateRecord.mockResolvedValue({ patchId } as GameStateEntityType);
      gameStateObjectManager.getGameState.mockResolvedValue(latestGameState);

      const result = await gameApiController.getLatestGameState(apiRequest);

      expect(result).toEqual(latestGameState);
      expect(gameStateObjectManager.getGameState).toHaveBeenCalledWith(gameId, patchId);
    });

    it('should throw NotFoundError if no game state is found', async () => {
      apiRequest.path = '/v1/game/12345';
      gameStateRecordManager.getLatestGameStateRecord.mockResolvedValue(null);

      await expect(gameApiController.getLatestGameState(apiRequest)).rejects.toThrow(NotFoundError);
    });
  });
});
