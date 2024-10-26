import { GameRecordManager } from '../db/game';
import { Game, GameCollection } from 'api-types/src/game';
import { BadRequestError } from '../error';
import { ApiRequest } from './request-handling';

export class GameApiController {
  private readonly gameRecordManager: GameRecordManager;

  constructor(gameRecordManager: GameRecordManager) {
    this.gameRecordManager = gameRecordManager;
  }

  async addGame(apiRequest: ApiRequest): Promise<void> {
    if (apiRequest.body) {
      await this.gameRecordManager.addGame(JSON.parse(apiRequest.body) as Game);
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

  async completeGame(apiRequest: ApiRequest): Promise<void> {
    // path should be in the format of 'v1/game/{gameId}'
    const gameId = apiRequest.path.split('/')[3];
    console.log(gameId);
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
}
