import { Injectable } from '@angular/core';
import { Area, AreaState } from '../../model/area.model';
import { GameElementRegistryService } from './game-element-registry.service';
import { AreaStateService } from './area-state.service';

@Injectable({
  providedIn: 'root',
})
export class AreaRegistryService extends GameElementRegistryService<
  AreaState,
  Area,
  AreaStateService
> {
  constructor(protected areaStateSvc: AreaStateService) {
    super(areaStateSvc);
  }
}
