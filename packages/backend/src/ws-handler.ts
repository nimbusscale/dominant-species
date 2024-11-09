import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { ensureDefined } from './lib/util';
import { ClientEntity, ClientRecordManager } from './lib/db/client-record-manager';
import { StatusCodes } from 'http-status-codes';
import { StateApiController } from './lib/api/state-api-controller';
import { GameStateEntity, GameStateRecordManager } from './lib/db/game-state-record-manager';
import { GameStateObjectManager } from './lib/state/game-state-object-manager';
import { createResponseFromError } from './lib/error';
import {ApiGatewayManagementApiClient} from "@aws-sdk/client-apigatewaymanagementapi";
import {EnvVarNames} from "./lib/enum";

const apiGwClient = new ApiGatewayManagementApiClient({
      endpoint: process.env[EnvVarNames.VPA_STATE_API_GW_URL]
    })
const clientRecordManager = new ClientRecordManager(ClientEntity);
const gameStateRecordManager = new GameStateRecordManager(GameStateEntity);
const gameStateObjectManager = new GameStateObjectManager();
const stateApiController = new StateApiController(
  apiGwClient,
  clientRecordManager,
  gameStateRecordManager,
  gameStateObjectManager,
);

export const wsHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    const route = ensureDefined(event.requestContext.routeKey);

    switch (route) {
      case '$connect': {
        await stateApiController.connect(event);
        break;
      }
      case '$disconnect': {
        await stateApiController.disconnect(event);
        break;
      }
      case '$default': {
        await stateApiController.applyGsp(event)
      }
    }
    callback(null, { statusCode: StatusCodes.OK});
  } catch (error) {
    console.error(event);
    callback(null, createResponseFromError(error as Error));
  }
};
