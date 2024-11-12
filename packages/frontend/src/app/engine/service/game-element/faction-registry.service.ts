import { Injectable } from '@angular/core';
import { Faction } from '../../model/faction.model';
import { GameElementRegistryService } from './game-element-registry.service';
import { FactionStateService } from './faction-state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FactionState } from 'api-types/src/game-state';

export interface FactionAssignment {
  factionId: string;
  ownerId: string;
}

@Injectable({
  providedIn: 'root',
})
export class FactionRegistryService extends GameElementRegistryService<
  FactionState,
  Faction,
  FactionStateService
> {
  private factionAssignment: FactionAssignment[] = [];
  private factionAssignmentSubject = new BehaviorSubject<FactionAssignment[]>(
    this.factionAssignment,
  );
  factionAssignment$: Observable<FactionAssignment[]> =
    this.factionAssignmentSubject.asObservable();
  constructor(protected factionStateSvc: FactionStateService) {
    super(factionStateSvc);
  }

  override register(elements: Faction | Faction[]): void {
    const elementsArray = Array.isArray(elements) ? elements : [elements];
    super.register(elementsArray);
    elementsArray.forEach((faction) => {
      this.factionAssignment.push({
        factionId: faction.id,
        ownerId: faction.ownerId,
      });
    });
    this.factionAssignmentSubject.next(this.factionAssignment);
  }
}
