import { Injectable } from '@angular/core';
import { Faction } from '../../model/faction.model';
import { GameElementStateService } from './game-element-state.service';
import { FactionState } from 'api-types/src/game-state';

@Injectable({
  providedIn: 'root',
})
export class FactionStateService extends GameElementStateService<FactionState, Faction> {
  protected get elementState$() {
    return this.gameStateSvc.faction$;
  }

  protected registerEntityState(faction: Faction) {
    this.gameStateSvc.registerFaction(faction.state);
  }

  protected setEntityState(state: FactionState) {
    this.gameStateSvc.setFaction(state);
  }
}
