import {CognitoJwtVerifier} from "aws-jwt-verify";
import {EnvVarNames} from "./enum";
import {ensureDefined} from "./util";
import {CognitoIdTokenPayload, CognitoJwtPayload} from "aws-jwt-verify/jwt-model";

export type CognitoTokenType = 'id' | 'access'



export async function validateCognitoJwt(jwt: string, tokenType: CognitoTokenType): Promise<CognitoJwtPayload | null> {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: ensureDefined(process.env[EnvVarNames.COGNITO_USER_POOL_ID]),
    tokenUse: tokenType,
    clientId: ensureDefined(process.env[EnvVarNames.COGNITO_CLIENT_ID]),
  });

  try {
    return await verifier.verify(jwt)
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function validateCognitoIdJwt(jwt: string): Promise<CognitoIdTokenPayload | null> {
  return await validateCognitoJwt(jwt, 'id') as CognitoIdTokenPayload
}

