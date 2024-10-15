import { Injectable } from '@angular/core';
import { Player } from '../model/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  readonly players: Player[] = [
    new Player({ id: 'test1', name: 'Test Player1' }),
    new Player({ id: 'test2', name: 'Test Player2' }),
    new Player({ id: 'test3', name: 'Test Player3' }),
    new Player({ id: 'test4', name: 'Test Player4' }),
    new Player({ id: 'test5', name: 'Test Player5' }),
    new Player({ id: 'test6', name: 'Test Player6' })
  ] as const;
  readonly currentPlayer: Player = this.players[0]
}
