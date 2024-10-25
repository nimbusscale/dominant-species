import {APIGatewayProxyEvent, Callback, Context, Handler} from "aws-lambda";

export const apiHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event)
  callback(null, {"statusCode": 200, "body": "Hello World!"})
}
