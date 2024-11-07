import {APIGatewayProxyEvent, Callback, Context, Handler} from "aws-lambda";

export const wsHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event)
  callback(null, {"statusCode": 200});
};
