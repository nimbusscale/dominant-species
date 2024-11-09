import { expect, jest, it, describe } from '@jest/globals';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { StateApiController } from '../../../lib/api/state-api-controller';
import { ClientEntity, ClientRecordManager } from '../../../lib/db/client-record-manager';
import { GameStateEntity, GameStateRecordManager } from '../../../lib/db/game-state-record-manager';
import { GameStateObjectManager } from '../../../lib/state/game-state-object-manager';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ensureDefined } from '../../../lib/util';
import { BadRequestError } from '../../../lib/error';
import { GameState } from 'api-types/src/game-state';

// Mock dependencies
jest.mock('../../../lib/util');
jest.mock('../../../lib/db/client-record-manager');
jest.mock('../../../lib/db/game-state-record-manager');
jest.mock('../../../lib/state/game-state-object-manager');
jest.mock('@aws-sdk/client-apigatewaymanagementapi');

describe('StateApiController', () => {
  let stateApiController: StateApiController;
  let mockApiGwClient: jest.Mocked<ApiGatewayManagementApiClient>;
  let mockClientRecordManager: jest.Mocked<ClientRecordManager>;
  let mockGameStateRecordManager: jest.Mocked<GameStateRecordManager>;
  let mockGameStateObjectManager: jest.Mocked<GameStateObjectManager>;

  beforeEach(() => {
    const mockClientEntity = jest.fn() as unknown as typeof ClientEntity;
    const mockGameStateEntity = jest.fn() as unknown as typeof GameStateEntity;
    mockApiGwClient =
      new ApiGatewayManagementApiClient() as jest.Mocked<ApiGatewayManagementApiClient>;
    mockClientRecordManager = new ClientRecordManager(
      mockClientEntity,
    ) as jest.Mocked<ClientRecordManager>;
    mockGameStateRecordManager = new GameStateRecordManager(
      mockGameStateEntity,
    ) as jest.Mocked<GameStateRecordManager>;
    mockGameStateObjectManager =
      new GameStateObjectManager() as jest.Mocked<GameStateObjectManager>;

    stateApiController = new StateApiController(
      mockApiGwClient,
      mockClientRecordManager,
      mockGameStateRecordManager,
      mockGameStateObjectManager,
    );
  });

  describe('connect', () => {
    it('should add a client if query parameters are present', async () => {
      const event = {
        requestContext: { connectionId: '123' },
        queryStringParameters: { gameId: 'game123', playerId: 'player123' },
      } as unknown as APIGatewayProxyEvent;

      (ensureDefined as jest.Mock).mockImplementation((val) => val);

      await stateApiController.connect(event);

      expect(mockClientRecordManager.addClient).toHaveBeenCalledWith('game123', '123', 'player123');
    });

    it('should throw BadRequestError if query parameters are missing', async () => {
      const event = {
        requestContext: { connectionId: '123' },
        queryStringParameters: null,
      } as unknown as APIGatewayProxyEvent;

      await expect(stateApiController.connect(event)).rejects.toThrow(BadRequestError);
    });
  });

  describe('disconnect', () => {
    it('should remove a client using connectionId', async () => {
      const event = {
        requestContext: { connectionId: '123' },
      } as unknown as APIGatewayProxyEvent;

      (ensureDefined as jest.Mock).mockImplementation((val) => val);

      await stateApiController.disconnect(event);

      expect(mockClientRecordManager.removeClient).toHaveBeenCalledWith('123');
    });
  });

  describe('applyGsp', () => {
    it('should update game state and send GSP to other clients', async () => {
      const event = {
        requestContext: { connectionId: 'client123' },
        body: JSON.stringify({
          gameId: 'game123',
          patchId: 1,
          patch: [],
        }),
      } as unknown as APIGatewayProxyEvent;

      const gsp = {
        gameId: 'game123',
        patchId: 1,
        patch: [],
      };

      const gameState = {
        patchId: 0,
        gameElements: {},
      } as unknown as GameState;

      (ensureDefined as jest.Mock).mockImplementation((val) => val);
      mockGameStateObjectManager.getGameState.mockResolvedValue(gameState);
      mockClientRecordManager.getClientsForGame.mockResolvedValue(['client123', 'client456']);

      await stateApiController.applyGsp(event);

      expect(mockGameStateObjectManager.getGameState).toHaveBeenCalledWith('game123', 0);
      expect(mockGameStateObjectManager.putGameState).toHaveBeenCalled();
      expect(mockGameStateRecordManager.addGameStatePatch).toHaveBeenCalledWith(gsp);
      expect(mockApiGwClient.send).toHaveBeenCalledWith(expect.any(PostToConnectionCommand));
    });

    it('should throw BadRequestError if event body is missing', async () => {
      const event = {
        requestContext: { connectionId: 'client123' },
        body: null,
      } as unknown as APIGatewayProxyEvent;

      await expect(stateApiController.applyGsp(event)).rejects.toThrow(BadRequestError);
    });
  });
});
