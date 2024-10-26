import { GameRecordManager } from '../db/game';
import { GameCollection } from 'api-types/src/game';
import { BadRequestError } from '../../error';
import {ApiEvent} from "./request-handling";

export class GameApiController {
  private readonly gameRecordManager: GameRecordManager;

  constructor(gameRecordManager: GameRecordManager) {
    this.gameRecordManager = gameRecordManager;
  }

  async getGameForUser(getEvent: ApiEvent): Promise<GameCollection> {
    const usernameQueryParam = getEvent.queryStringParameters?.username;
    if (usernameQueryParam) {
      return {
        games: await this.gameRecordManager.getGamesForPlayer(usernameQueryParam),
      };
    } else {
      throw new BadRequestError('must include username query param');
    }
  }
}
