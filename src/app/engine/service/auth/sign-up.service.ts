import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private cognitoClientService: CognitoClientService) {}

  async signUp(username: string, email: string, password: string): Promise<boolean> {
    return this.cognitoClientService.signUp(username, email, password);
  }

  async confirmSignUp(username: string, code: string): Promise<boolean> {
    return  this.cognitoClientService.confirmSignUp(username, code);
  }
}
