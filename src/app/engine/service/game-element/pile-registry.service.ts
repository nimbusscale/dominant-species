import { Injectable } from '@angular/core';
import { Pile, PileState } from '../../model/pile.model';
import { PileStateService } from './pile-state.service';
import { GameElementRegistryService } from './game-element-registry.service';

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
