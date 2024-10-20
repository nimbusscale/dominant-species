import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private cognitoClientService: CognitoClientService) {}

  async login(username: string, password: string): Promise<boolean> {
    const authResult = await this.cognitoClientService.login(username, password);
    if (authResult) {
      console.log(JSON.stringify(authResult));
      return true;
    } else {
      return false;
    }
  }
}
