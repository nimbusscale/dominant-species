import { JwtPayload } from 'jwt-decode';

export interface CognitoIdTokenJwt extends JwtPayload {
  email_verified: boolean;
  ['cognito:username']: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  email: string;
}
