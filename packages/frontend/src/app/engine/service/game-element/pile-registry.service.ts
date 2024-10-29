import { Injectable } from '@angular/core';
import { Pile } from '../../model/pile.model';
import { PileStateService } from './pile-state.service';
import { GameElementRegistryService } from './game-element-registry.service';
import {PileState} from "api-types/src/game-state";

@Injectable({
  providedIn: 'root',
})
export class PileRegistryService extends GameElementRegistryService<
  PileState,
  Pile,
  PileStateService
> {
  constructor(protected pileStateSvc: PileStateService) {
    super(pileStateSvc);
  }
}
