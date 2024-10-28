import {Injectable} from '@angular/core';
import {Player} from 'api-types/src/player';
import {AuthService} from '../auth/auth.service';
import {GameManagementClientService} from "./game-management-client.service";
import {ensureDefined} from "../../util/misc";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  currentPlayer: Player| undefined = undefined;
  private currentPlayerSubject: BehaviorSubject<Player | undefined> = new BehaviorSubject<Player | undefined>(this.currentPlayer);
  currentPlayer$ = this.currentPlayerSubject.asObservable()

  constructor(
    private authService: AuthService,
    private gameManagementClientService: GameManagementClientService
  ) {
    this.authService.isLoggedIn$.pipe().subscribe(async (isLoggedIn) => {
      if (isLoggedIn) {
        this.currentPlayer = await this.gameManagementClientService.getLoggedInPlayer()
        this.currentPlayerSubject.next(this.currentPlayer)
        } else {
        this.currentPlayer = undefined
        this.currentPlayerSubject.next(this.currentPlayer)
      }
    })
  }

  async findPlayers(username: string): Promise<string[]> {
    const playerCollection = await this.gameManagementClientService.findPlayers(username);
    return playerCollection.map((player) => player.username);
  }

  async addfriend(username: string): Promise<void> {
    ensureDefined(this.currentPlayer).friends.push(username)
    return await this.gameManagementClientService.setFriends(ensureDefined(this.currentPlayer))
  }

  async removeFriend(username: string): Promise<void> {
    ensureDefined(this.currentPlayer).friends = ensureDefined(this.currentPlayer).friends.filter((friendUsername) => friendUsername !== username)
    return await this.gameManagementClientService.setFriends(ensureDefined(this.currentPlayer))
  }
}
