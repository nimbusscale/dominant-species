import {APIGatewayProxyEvent} from 'aws-lambda';
import {ensureDefined} from '../util';
import {BadRequestError} from '../error';
import {ClientRecordManager} from '../db/client-record-manager';
import {GameStateRecordManager} from '../db/game-state-record-manager';
import {GameStateObjectManager} from '../state/game-state-object-manager';
import {GameStatePatch} from 'api-types/src/game-state';
import {applyPatch} from "fast-json-patch";
import {ApiGatewayManagementApiClient, PostToConnectionCommand} from "@aws-sdk/client-apigatewaymanagementapi";

export class StateApiController {
  private readonly apiGwClient: ApiGatewayManagementApiClient
  private readonly clientRecordManager: ClientRecordManager;
  private readonly gameStateRecordManager: GameStateRecordManager;
  private readonly gameStateObjectManager: GameStateObjectManager;

  constructor(
    apiGwClient: ApiGatewayManagementApiClient,
    clientRecordManager: ClientRecordManager,
    gameStateRecordManager: GameStateRecordManager,
    gameStateObjectManager: GameStateObjectManager
  ) {
    this.apiGwClient = apiGwClient;
    this.clientRecordManager = clientRecordManager;
    this.gameStateRecordManager = gameStateRecordManager;
    this.gameStateObjectManager = gameStateObjectManager;
  }

  async connect(event: APIGatewayProxyEvent): Promise<void> {
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

  async disconnect(event: APIGatewayProxyEvent): Promise<void> {
    const clientId = ensureDefined(event.requestContext.connectionId);
    await this.clientRecordManager.removeClient(clientId);
  }


  private getGspFromEvent(event: APIGatewayProxyEvent): GameStatePatch {
    if (event.body) {
      return JSON.parse(event.body) as GameStatePatch
    } else {
      throw new BadRequestError("Request must include body")
    }
  }

  private async updateGameState(gsp: GameStatePatch): Promise<void> {
    // The previous patchId is the one before this one.
    const gameState = await this.gameStateObjectManager.getGameState(gsp.gameId, gsp.patchId - 1)
    gameState.patchId = gsp.patchId
    gameState.gameElements = applyPatch(
      gameState.gameElements,
      gsp.patch,
      undefined,
      false
    ).newDocument
    await Promise.all([
      this.gameStateObjectManager.putGameState(gameState),
      this.gameStateRecordManager.addGameStatePatch(gsp)
    ])
  }

  private async sendGspToOtherClients(sendingClientId: string, gsp: GameStatePatch): Promise<void> {
    const gspJSON = JSON.stringify(gsp)
    const clientIds = await this.clientRecordManager.getClientsForGame(gsp.gameId)
    await Promise.all(clientIds.filter((clientId) => clientId !== sendingClientId).map((clientId) => {
      this.apiGwClient.send(new PostToConnectionCommand({ConnectionId: clientId, Data: gspJSON}))
    }))
  }

  async applyGsp(event: APIGatewayProxyEvent): Promise<void> {
    const clientId = ensureDefined(event.requestContext.connectionId);
    const gsp = this.getGspFromEvent(event)
    await this.updateGameState(gsp)
    await this.sendGspToOtherClients(clientId, gsp)
  }
}
