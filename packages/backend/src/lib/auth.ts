import {CognitoJwtVerifier} from "aws-jwt-verify";
import {EnvVarNames} from "./enum";
import {ensureDefined} from "./util";

export async function validateCognitoJwt(jwt: string): Promise<boolean> {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: ensureDefined(process.env[EnvVarNames.COGNITO_USER_POOL_ID]),
    tokenUse: "id",
    clientId: ensureDefined(process.env[EnvVarNames.COGNITO_CLIENT_ID]),
  });

  try {
    await verifier.verify(jwt);
    return true
  } catch {
    return false
  }
}

