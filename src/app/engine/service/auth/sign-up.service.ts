import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private cognitoClientService: CognitoClientService) {}

  // Todo: add signalling to the calling components if there was an error so something can be displayed to the end user
  signUp(username: string, email: string, password: string): void {
    void this.cognitoClientService.signUp(username, email, password);
  }

  confirmSignUp(username: string, code: string): void {
    void this.cognitoClientService.confirmSignUp(username, code);
  }
}
