import { APIGatewayProxyEvent } from 'aws-lambda';
import { ensureDefined } from '../util';
import { BadRequestError } from '../error';
import { ClientRecordManager } from '../db/client-record-manager';
import { GameStateRecordManager } from '../db/game-state-record-manager';
import { GameStateObjectManager } from '../state/game-state-object-manager';

export class StateApiController {
  private readonly clientRecordManager: ClientRecordManager;
  private readonly gameStateRecordManager: GameStateRecordManager;
  private readonly gameStateObjectManager: GameStateObjectManager;

  constructor(
    clientRecordManager: ClientRecordManager,
    gameStateRecordManager: GameStateRecordManager,
    gameStateObjectManager: GameStateObjectManager,
  ) {
    this.clientRecordManager = clientRecordManager;
    this.gameStateRecordManager = gameStateRecordManager;
    this.gameStateObjectManager = gameStateObjectManager;
  }

  async connect(event: APIGatewayProxyEvent): Promise<undefined> {
    const clientId = ensureDefined(event.requestContext.connectionId);
    const queryStringParameters = event.queryStringParameters;
    if (queryStringParameters) {
      const gameId = ensureDefined(queryStringParameters['gameId']);
      const playerId = ensureDefined(queryStringParameters['playerId']);
      await this.clientRecordManager.addClient(gameId, clientId, playerId);
    } else {
      throw new BadRequestError('must define gameId and playerId query params');
    }
  }

  async disconnect(event: APIGatewayProxyEvent): Promise<undefined> {
    const clientId = ensureDefined(event.requestContext.connectionId);
    await this.clientRecordManager.removeClient(clientId);
  }
}
