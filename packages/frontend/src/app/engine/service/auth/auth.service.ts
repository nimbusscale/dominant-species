import { Injectable } from '@angular/core';
import { CognitoClientService } from './cognito-client.service';
import { LocalStorageService } from '../local-storage.service';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { PlayerAuthData } from '../../model/player.model';
import { ensureDefined } from '../../util/misc';
import { LocalStorageKey } from '../../constant/local-storage.constant';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isLoggedInSubject: BehaviorSubject<boolean>;
  readonly isLoggedIn$: Observable<boolean>;

  constructor(
    private cognitoClientService: CognitoClientService,
    private localStorageService: LocalStorageService,
  ) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.checkIsLoggedIn());
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  private authResultToPlayerAuth(authResult: AuthenticationResultType): PlayerAuthData {
    const jwt = this.cognitoClientService.decodeJwtToken(ensureDefined(authResult.IdToken));
    return {
      username: ensureDefined(jwt['cognito:username']),
      accessToken: ensureDefined(authResult.IdToken),
      accessTokenExpire: ensureDefined(jwt.exp),
      refreshToken: ensureDefined(authResult.RefreshToken),
    };
  }

  async login(username: string, password: string): Promise<boolean> {
    const authResult = await this.cognitoClientService.login(username, password);
    console.log(authResult);
    if (authResult) {
      this.localStorageService.setStorageKey(
        LocalStorageKey.PLAYER_AUTH_DATA,
        JSON.stringify(this.authResultToPlayerAuth(authResult)),
      );
      this.isLoggedInSubject.next(true);
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    if (this.playerAuthData) {
      this.localStorageService.deletedStorageKey(LocalStorageKey.PLAYER_AUTH_DATA);
    }
    this.isLoggedInSubject.next(false);
  }

  get playerAuthData(): PlayerAuthData | undefined {
    const playerAuthData = this.localStorageService.getStorageKey(LocalStorageKey.PLAYER_AUTH_DATA);
    if (playerAuthData) {
      return JSON.parse(playerAuthData) as PlayerAuthData;
    } else {
      return undefined;
    }
  }

  get loggedInUsername(): string {
    if (this.playerAuthData) {
      return this.playerAuthData.username;
    } else {
      throw new Error('No user logged in');
    }
  }

  private validatePlayerAuthData(playerAuthData: PlayerAuthData): boolean {
    return Date.now() < playerAuthData.accessTokenExpire * 1000;
  }

  checkIsLoggedIn(): boolean {
    return !!(this.playerAuthData && this.validatePlayerAuthData(this.playerAuthData));
  }
}
