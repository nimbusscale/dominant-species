import { GameRecordManager } from '../db/game';
import { GameCollection } from 'api-types/src/game';
import { BadRequestError } from '../error';
import { ApiRequest } from './request-handling';

export class GameApiController {
  private readonly gameRecordManager: GameRecordManager;

  constructor(gameRecordManager: GameRecordManager) {
    this.gameRecordManager = gameRecordManager;
  }

  async addGame(apiRequest: ApiRequest): Promise<void> {

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
}
