import { jwtDecode } from 'jwt-decode';
import { CognitoIdTokenJwt } from 'api-types/src/auth';
import { ensureDefined } from '../../util';

export function getUsernameFromIdToken(token: string): string {
  const decodedToken: CognitoIdTokenJwt = jwtDecode(token);
  return ensureDefined(decodedToken['cognito:username']);
}
