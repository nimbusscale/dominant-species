import { Injectable } from '@angular/core';
import { Pile, PileState } from '../../model/pile.model';
import { GameElementStateService } from './game-element-state.service';

@Injectable({
  providedIn: 'root',
})
export class PileStateService extends GameElementStateService<PileState, Pile> {
  protected get elementState$() {
    return this.gameStateSvc.pile$;
  }

  protected registerEntityState(pile: Pile) {
    this.gameStateSvc.registerPile(pile.state);
  }

  protected setEntityState(state: PileState) {
    this.gameStateSvc.setPile(state);
  }
}
