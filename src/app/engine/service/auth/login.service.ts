import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';
import { LocalStorageService } from '../local-storage.service';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { PlayerAuthData } from '../../model/player.model';
import { ensureDefined } from '../../util/misc';
import {LocalStorageKey} from "../../constant/local-storage";

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private cognitoClientService: CognitoClientService,
    private localStorageService: LocalStorageService,
  ) {}

  private authResultToPlayerAuth(authResult: AuthenticationResultType): PlayerAuthData {
    const jwt = this.cognitoClientService.decodeJwtToken(ensureDefined(authResult.IdToken));
    return {
      id: ensureDefined(jwt['cognito:username']),
      accessToken: ensureDefined(authResult.AccessToken),
      accessTokenExpire: ensureDefined(jwt.exp),
      refreshToken: ensureDefined(authResult.RefreshToken),
    };
  }

  async login(username: string, password: string): Promise<boolean> {
    const authResult = await this.cognitoClientService.login(username, password);
    if (authResult) {
      localStorage.setItem(LocalStorageKey.PLAYER_AUTH_DATA, JSON.stringify(authResult));
      return true;
    } else {
      return false;
    }
  }
}
