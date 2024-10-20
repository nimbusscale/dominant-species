import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';
import { LocalStorageService } from '../local-storage.service';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { PlayerAuthData } from '../../model/player.model';
import { ensureDefined } from '../../util/misc';
import { LocalStorageKey } from '../../constant/local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cognitoClientService: CognitoClientService,
    private localStorageService: LocalStorageService,
  ) {}

  private authResultToPlayerAuth(authResult: AuthenticationResultType): PlayerAuthData {
    const jwt = this.cognitoClientService.decodeJwtToken(ensureDefined(authResult.AccessToken));
    return {
      id: ensureDefined(jwt.username),
      accessToken: ensureDefined(authResult.AccessToken),
      accessTokenExpire: ensureDefined(jwt.exp),
      refreshToken: ensureDefined(authResult.RefreshToken),
    };
  }

  async login(username: string, password: string): Promise<boolean> {
    const authResult = await this.cognitoClientService.login(username, password);
    if (authResult) {
      this.localStorageService.setStorageKey(
        LocalStorageKey.PLAYER_AUTH_DATA,
        JSON.stringify(this.authResultToPlayerAuth(authResult)),
      );
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    if (this.playerAuthData) {
      this.localStorageService.deletedStorageKey(LocalStorageKey.PLAYER_AUTH_DATA);
    }
  }

  get playerAuthData(): PlayerAuthData | null {
    const playerAuthData = this.localStorageService.getStorageKey(LocalStorageKey.PLAYER_AUTH_DATA);
    if (playerAuthData) {
      return JSON.parse(playerAuthData) as PlayerAuthData;
    } else {
      return null;
    }
  }

  private validatePlayerAuthData(playerAuthData: PlayerAuthData): boolean {
    return Date.now() < playerAuthData.accessTokenExpire * 1000;
  }

  get isLoggedIn(): boolean {
    return !!(this.playerAuthData && this.validatePlayerAuthData(this.playerAuthData));
  }
}
