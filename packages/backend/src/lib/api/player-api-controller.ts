import { PlayerRecordManager } from '../db/player-record-manager';
import { ApiRequest } from './request-handling';
import { Player, PlayerCollection } from 'api-types/src/player';
import { BadRequestError, NotFoundError } from '../error';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

export class PlayerApiController {
  private readonly playerRecordManager: PlayerRecordManager;

  constructor(playerRecordManager: PlayerRecordManager) {
    this.playerRecordManager = playerRecordManager;
  }

  async getPlayer(apiRequest: ApiRequest): Promise<Player> {
    // path should be in the format of '/v1/player/{username}'
    const username = apiRequest.path.split('/')[3];
    const response = await this.playerRecordManager.getPlayer(username);
    if (response) {
      return response;
    } else {
      throw new NotFoundError();
    }
  }

  async findPlayers(apiRequest: ApiRequest): Promise<PlayerCollection> {
    const usernameQueryParam = apiRequest.queryStringParameters?.username;
    if (usernameQueryParam) {
      return {
        players: await this.playerRecordManager.findPlayers(usernameQueryParam),
      };
    } else {
      throw new BadRequestError('must include username query param');
    }
  }

  async setFriends(apiRequest: ApiRequest): Promise<void> {
    // path should be in the format of '/v1/player/{username}'
    const username = apiRequest.path.split('/')[3];
    // This doesn't handle invalid requests very well, should revisit in the future.
    if (apiRequest.body) {
      const player = JSON.parse(apiRequest.body) as Player;
      try {
        await this.playerRecordManager.setFriends(username, player.friends);
      } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
          throw new NotFoundError();
        } else {
          throw error;
        }
      }
    } else {
      throw new BadRequestError('Missing Body');
    }
  }
}
