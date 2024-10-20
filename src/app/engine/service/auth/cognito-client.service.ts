import { Injectable } from '@angular/core';
import {
  AuthenticationResultType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { environment } from '../../../../environments/environment';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface CognitoJwtPayload extends JwtPayload {
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoClientService {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: environment.cognito.region,
    });
  }

  async login(username: string, password: string): Promise<AuthenticationResultType | null> {
    const input = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: environment.cognito.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    } as InitiateAuthCommandInput;
    const command = new InitiateAuthCommand(input);
    try {
      const { AuthenticationResult } = await this.cognitoClient.send(command);
      if (AuthenticationResult) {
        return AuthenticationResult;
      } else {
        console.error('Unexpected AuthenticationResult');
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  decodeJwtToken(token: string): CognitoJwtPayload {
    return jwtDecode(token);
  }

  async signUp(username: string, email: string, password: string): Promise<boolean> {
    const input = {
      ClientId: environment.cognito.clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };
    try {
      const command = new SignUpCommand(input);
      void (await this.cognitoClient.send(command));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async confirmSignUp(username: string, code: string): Promise<boolean> {
    const input = {
      ClientId: environment.cognito.clientId,
      Username: username,
      ConfirmationCode: code,
    };
    try {
      const command = new ConfirmSignUpCommand(input);
      void (await this.cognitoClient.send(command));
      return true;
    } catch (error) {
      console.error('Error confirming sign up: ', error);
      return false;
    }
  }
}
