import {APIGatewayProxyEvent, Callback, Context, Handler} from "aws-lambda";
import {ensureDefined} from "./lib/util";
import {ClientEntity, ClientRecordManager} from "./lib/db/client-record-manager";
import {BadRequestError} from "./lib/error";
import {StatusCodes} from "http-status-codes";

const clientRecordManager = new ClientRecordManager(ClientEntity)

export const wsHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event)
  const route = ensureDefined(event.requestContext.routeKey)
  const clientId = ensureDefined(event.requestContext.connectionId)

  switch (route) {
    case '$connect': {
      const queryStringParameters = event.queryStringParameters
      if (queryStringParameters) {
        const gameId = ensureDefined(queryStringParameters['gameId'])
        const playerId = ensureDefined(queryStringParameters['playerId'])
        await clientRecordManager.addClient(gameId, clientId, playerId)
        callback(null, {"statusCode": 200});
        break
      } else {
        // throw new BadRequestError("must define gameId and playerId query params")
        callback(null, {
          statusCode: StatusCodes.BAD_REQUEST,
          body: JSON.stringify({message: "must define gameId and playerId query params"})
        });
        break
      }
    }
    case '$disconnect': {
      await clientRecordManager.removeClient(clientId)
      callback(null, {"statusCode": 200});
      break
    }
  }
};
