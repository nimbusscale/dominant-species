import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private cognitoClientService: CognitoClientService) {}

  signUp(username: string, email: string, password: string): void {
    void this.cognitoClientService.signUp(username, email, password);
  }
}
