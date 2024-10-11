import { Injectable } from '@angular/core';
import { Area, AreaState } from '../../model/area.model';
import { GameElementStateService } from './game-element-state.service';

@Injectable({
  providedIn: 'root',
})
export class AreaStateService extends GameElementStateService<AreaState, Area> {
  protected get elementState$() {
    return this.gameStateSvc.area$;
  }

  protected registerEntityState(area: Area) {
    this.gameStateSvc.registerArea(area.state);
  }

  protected setEntityState(state: AreaState) {
    this.gameStateSvc.setArea(state);
  }
}
