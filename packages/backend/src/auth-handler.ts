import {APIGatewayAuthorizerResult, Callback, Context, Handler} from "aws-lambda";
import {validateCognitoIdJwt} from "./lib/auth";
import {APIGatewayRequestAuthorizerEvent} from "aws-lambda/trigger/api-gateway-authorizer";
import {CognitoIdTokenPayload} from "aws-jwt-verify/jwt-model";


function getAuthHeader(event: APIGatewayRequestAuthorizerEvent): string | undefined {
  const headers = event.headers
  if (headers) {
    return headers['Authorization']
  } else {
    return undefined
  }
}

function buildAuthResponse(event: APIGatewayRequestAuthorizerEvent, jwtPayload: CognitoIdTokenPayload): APIGatewayAuthorizerResult {
  return {
        principalId: jwtPayload["cognito:username"],
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Allow",
              Resource: event.methodArn
            }
          ]
        }
      }
}

export const authHandler: Handler = async (
  event: APIGatewayRequestAuthorizerEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event)
  const jwt = getAuthHeader(event)
  if (jwt) {
    const payload = await validateCognitoIdJwt(jwt)
    if (payload) {
      callback(null, buildAuthResponse(event, payload))
    }
  }
  // if we get here, then we were not able to auth the user
  callback("Unauthorized", null)
};
