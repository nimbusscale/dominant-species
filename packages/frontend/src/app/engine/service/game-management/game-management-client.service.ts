import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Game, GameCollection} from "api-types/src/game";
import {map, Observable} from "rxjs";
import {Player, PlayerCollection} from "api-types/src/player";


@Injectable({
  providedIn: 'root'
})
export class GameManagementClientService {
  constructor(private http: HttpClient, private authService: AuthService) {

  }

  private get loggedInUsername(): string {
    if (this.authService.playerAuthData) {
      return this.authService.playerAuthData.username
    } else {
      throw new Error('No user logged in')
    }
  }

  createGame(game: Game): Observable<void> {
    return this.http.post<void>('/game', game);
  }

  getGamesForLoggedInPlayer(): Observable<Game[]> {
    return this.http.get<GameCollection>('/game', {
      params: { username: this.loggedInUsername },
    }).pipe(
      map((gameCollection) => gameCollection.games)
    );
  }

  completeGame(gameId: string): Observable<void> {
    return this.http.patch<void>(`/game/${gameId}`, {complete: true})
  }

  getPlayer(username: string): Observable<Player> {
    return this.http.get<Player>(`/player/${username}`);
  }

  getLoggedInPlayer(username: string): Observable<Player> {
    return this.http.get<Player>(`/game/${this.loggedInUsername}`);
  }

  findPlayers(username: string): Observable<PlayerCollection> {
    return this.http.get<PlayerCollection>('/player', {
      params: { username: username },
    })
  }

  setFriends(player: Player): Observable<void> {
    return this.http.patch<void>(`/player/${player.username}`, {friends: player.friends})
  }


}
