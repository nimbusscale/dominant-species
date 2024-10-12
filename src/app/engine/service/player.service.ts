import { Injectable } from '@angular/core';
import { Player } from '../model/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  readonly currentPlayer: Player = new Player({ id: 'test1', name: 'Test Player' });
  readonly players: Player[] = [this.currentPlayer] as const;
}
