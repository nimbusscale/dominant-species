import { Injectable } from '@angular/core';
import { baseGameState } from '../../game/dominant-species.constants';
import { PileService } from './pile.service';
import { Pile } from '../model/pile.model';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(private pileSvc: PileService) {}

  createGame(): void {
    const piles: Pile[] = [];
    baseGameState.pile.forEach((pileState) => {
      piles.push(new Pile(pileState));
    });
    this.pileSvc.register(piles);
  }
}
