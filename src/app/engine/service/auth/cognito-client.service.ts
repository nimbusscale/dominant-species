import { Injectable } from '@angular/core';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
  SignUpCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CognitoClientService {
  private cognitoClient: CognitoIdentityProviderClient

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: environment.cognito.region
    })
  }

  async signUp(username: string, email: string, password: string): Promise<SignUpCommandOutput> {
    const params = {
    ClientId: environment.cognito.clientId,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
    const command = new SignUpCommand(params);
    return await this.cognitoClient.send(command);
  }

  async confirmSignUp(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: environment.cognito.clientId,
      Username: username,
      ConfirmationCode: code,
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      await this.cognitoClient.send(command);
      return true;
    } catch (error) {
      console.error("Error confirming sign up: ", error);
      return false;
    }
  }
}
