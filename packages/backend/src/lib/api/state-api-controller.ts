import { APIGatewayProxyEvent } from 'aws-lambda';
import { ensureDefined } from '../util';
import { BadRequestError } from '../error';
import { ClientRecordManager } from '../db/client-record-manager';
import { GameStateRecordManager } from '../db/game-state-record-manager';
import { GameStateObjectManager } from '../state/game-state-object-manager';
import {GameStatePatch} from 'api-types/src/game-state';
import {applyPatch} from "fast-json-patch";

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

  async applyGsp(event: APIGatewayProxyEvent): Promise<undefined> {
    if (event.body) {
      const gsp = JSON.parse(event.body) as GameStatePatch
      // The previous patchId is the one before this one.
      const gameState = await this.gameStateObjectManager.getGameState(gsp.gameId, gsp.patchId - 1)
      gameState.patchId = gsp.patchId
      gameState.gameElements = applyPatch(
        gameState.gameElements,
        gsp.patch,
        undefined,
        false
      ).newDocument
      Promise.all([
        this.gameStateObjectManager.putGameState(gameState),
        this.gameStateRecordManager.addGameStatePatch(gsp)
      ]).then().catch((error: unknown) => {throw error})
    } else {
      throw new BadRequestError("Request must include body")
    }
  }
}
