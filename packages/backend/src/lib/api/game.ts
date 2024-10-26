import { GameRecordManager } from '../db/game';
import { StatusCodes } from 'http-status-codes';
import { BaseApiEvent } from './schema/api-event';
import { ApiResponse } from './schema/api-response';

export class GameApiController {
  private readonly gameRecordManager: GameRecordManager;
  constructor(gameRecordManager: GameRecordManager) {
    this.gameRecordManager = gameRecordManager;
  }

  async getGameForUser(getEvent: BaseApiEvent): Promise<ApiResponse> {
    let body: string;
    let code: number;

    const usernameQueryParam = getEvent.queryStringParameters?.username;
    if (usernameQueryParam) {
      try {
        body = JSON.stringify({
          games: await this.gameRecordManager.getGamesForPlayer(usernameQueryParam),
        });
        code = StatusCodes.OK;
      } catch (e) {
        body = JSON.stringify(e instanceof Error ? e.message : String(e));
        code = StatusCodes.INTERNAL_SERVER_ERROR;
      }
    } else {
      body = 'must include username query param';
      code = StatusCodes.BAD_REQUEST;
    }

    return { statusCode: code, body: body };
  }
}
