import { Injectable } from '@angular/core';
import { baseGameState } from '../../game/dominant-species.constants';
import { Pile } from '../model/pile.model';
import { PileRegistryService } from './pile-registry.service';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(private pileRegistrySvc: PileRegistryService) {}

  createGame(): void {
    const piles: Pile[] = [];
    baseGameState.pile.forEach((pileState) => {
      piles.push(new Pile(pileState));
    });
    this.pileRegistrySvc.register(piles);
  }
}
