import { Injectable } from '@angular/core';
import {CognitoClientService} from "./cognito-client.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private cognitoClientService: CognitoClientService) { }

  login(username: string, password: string): void {
    this.cognitoClientService.login(username, password).then((authResult) => {
      console.log(JSON.stringify(authResult))
    }
    )
  }
}
