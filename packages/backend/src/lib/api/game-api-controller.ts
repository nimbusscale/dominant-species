import { GameRecordManager } from '../db/game-record-manager';
import { Game, GameCollection } from 'api-types/src/game';
import {BadRequestError, NotFoundError} from '../error';
import { ApiRequest } from './request-handling';
import { GameStateRecordManager } from '../db/game-state-record-manager';
import {GameState} from "api-types/src/game-state";
import {GameStateObjectManager} from "../state/game-state-object-manager";
import {error} from "aws-cdk/lib/logging";

export class GameApiController {
  private readonly gameRecordManager: GameRecordManager;
  private readonly gameStateRecordManager: GameStateRecordManager;
  private readonly gameStateObjectManager: GameStateObjectManager

  constructor(
    gameRecordManager: GameRecordManager,
    gameStateRecordManager: GameStateRecordManager,
    gameStateObjectManager: GameStateObjectManager
  ) {
    this.gameRecordManager = gameRecordManager;
    this.gameStateRecordManager = gameStateRecordManager;
    this.gameStateObjectManager = gameStateObjectManager;
  }

  async addGame(apiRequest: ApiRequest): Promise<undefined> {
    if (apiRequest.body) {
      const game = JSON.parse(apiRequest.body) as Game;
      await this.gameRecordManager.addGame(game);
    } else {
      throw new BadRequestError('Missing Body');
    }
  }

  async getGamesForUser(apiRequest: ApiRequest): Promise<GameCollection> {
    const usernameQueryParam = apiRequest.queryStringParameters?.username;
    if (usernameQueryParam) {
      return {
        games: await this.gameRecordManager.getGamesForPlayer(usernameQueryParam),
      };
    } else {
      throw new BadRequestError('must include username query param');
    }
  }

  async completeGame(apiRequest: ApiRequest): Promise<undefined> {
    // path should be in the format of '/v1/game/{gameId}'
    const gameId = apiRequest.path.split('/')[3];
    if (apiRequest.body) {
      const body = JSON.parse(apiRequest.body) as Game;
      if (body.complete === true) {
        // This means that anyone can complete a game, regardless if they are the host.
        await this.gameRecordManager.completeGame(gameId);
      } else {
        throw new BadRequestError('complete must be set to true');
      }
    } else {
      throw new BadRequestError('Missing Body');
    }
  }

  async putInitialGameState(apiRequest: ApiRequest): Promise<undefined> {
    if (apiRequest.body) {
      const gameState = JSON.parse(apiRequest.body) as GameState
      void await this.gameStateRecordManager.addInitialGameState(gameState)
      void await this.gameStateObjectManager.putGameState(gameState)
    } else {
      throw new BadRequestError('Missing Body');
    }
  }

  async getLatestGameState(apiRequest: ApiRequest): Promise<GameState> {
    // path should be in the format of '/v1/game/{gameId}'
    const gameId = apiRequest.path.split('/')[3];
    const latestGameStateRecord = await this.gameStateRecordManager.getLatestGameStateRecord(gameId)
    if (latestGameStateRecord) {
      return await this.gameStateObjectManager.getGameState(gameId, latestGameStateRecord.patchId)
    } else {
      throw new NotFoundError();
    }
  }
}
