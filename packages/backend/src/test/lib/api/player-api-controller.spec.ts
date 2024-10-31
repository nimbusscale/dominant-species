import { expect, jest, it, describe } from '@jest/globals';
import { Player, PlayerCollection } from 'api-types/src/player';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { PlayerApiController } from '../../../lib/api/player-api-controller';
import { PlayerRecordManager } from '../../../lib/db/player-record-manager';
import { ApiRequest } from '../../../lib/api/request-handling';
import { BadRequestError, NotFoundError } from '../../../lib/error';

describe('PlayerApiController', () => {
  let playerApiController: PlayerApiController;
  let playerRecordManager: jest.Mocked<PlayerRecordManager>;
  let apiRequest: jest.Mocked<ApiRequest>;

  beforeEach(() => {
    playerRecordManager = {
      getPlayer: jest.fn(),
      findPlayers: jest.fn(),
      setFriends: jest.fn(),
    } as any;

    playerApiController = new PlayerApiController(playerRecordManager);

    apiRequest = {
      body: '',
      queryStringParameters: {},
      path: '',
    } as any;
  });

  describe('getPlayer', () => {
    it('should return player data if player exists', async () => {
      const username = 'testUser';
      const player: Player = {} as Player;
      apiRequest.path = `/v1/player/${username}`;
      playerRecordManager.getPlayer.mockResolvedValue(player);

      const result = await playerApiController.getPlayer(apiRequest);
      expect(result).toEqual(player);
    });

    it('should throw NotFoundError if player does not exist', async () => {
      apiRequest.path = '/v1/player/nonexistentUser';
      playerRecordManager.getPlayer.mockResolvedValue(null);

      await expect(playerApiController.getPlayer(apiRequest)).rejects.toThrow(NotFoundError);
    });
  });

  describe('findPlayers', () => {
    it('should return a collection of players when username query param is provided', async () => {
      const players: PlayerCollection = { players: [] };
      apiRequest.queryStringParameters = { username: 'testUser' };
      playerRecordManager.findPlayers.mockResolvedValue(players.players);

      const result = await playerApiController.findPlayers(apiRequest);

      expect(result).toEqual(players);
    });

    it('should throw BadRequestError if username query param is missing', async () => {
      apiRequest.queryStringParameters = {};

      await expect(playerApiController.findPlayers(apiRequest)).rejects.toThrow(BadRequestError);
    });
  });

  describe('setFriends', () => {
    it('should set friends for the player if body is provided', async () => {
      const username = 'testUser';
      const friendsList = ['friend1', 'friend2'];
      const player: Player = { friends: friendsList } as Player;
      apiRequest.path = `/v1/player/${username}`;
      apiRequest.body = JSON.stringify(player);

      await playerApiController.setFriends(apiRequest);
      expect(playerRecordManager.setFriends).toHaveBeenCalledWith(username, friendsList);
    });

    it('should throw NotFoundError if ConditionalCheckFailedException is thrown', async () => {
      const username = 'testUser';
      const player: Player = { friends: ['friend1', 'friend2'] } as Player;
      apiRequest.path = `/v1/player/${username}`;
      apiRequest.body = JSON.stringify(player);
      playerRecordManager.setFriends.mockRejectedValue(
        new ConditionalCheckFailedException({ $metadata: {}, message: 'error' }),
      );

      await expect(playerApiController.setFriends(apiRequest)).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if body is missing', async () => {
      apiRequest.path = '/v1/player/testUser';
      apiRequest.body = null;

      await expect(playerApiController.setFriends(apiRequest)).rejects.toThrow(BadRequestError);
    });
  });
});
