import { Injectable } from '@angular/core';
import { Area } from '../../model/area.model';
import { GameElementRegistryService } from './game-element-registry.service';
import { AreaStateService } from './area-state.service';
import { AreaState } from 'api-types/src/game-state';

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
