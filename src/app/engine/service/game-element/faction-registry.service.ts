import { Injectable } from '@angular/core';
import { Faction, FactionState } from '../../model/faction.model';
import { GameElementRegistryService } from './game-element-registry.service';
import { FactionStateService } from './faction-state.service';
import { BehaviorSubject, Observable } from 'rxjs';

interface FactionAssignment {
  id: string;
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

  override register(elements: Faction[]): void {
    super.register(elements);
    elements.forEach((faction) => {
      this.factionAssignment.push({
        id: faction.id,
        ownerId: faction.ownerId,
      });
    });
    this.factionAssignmentSubject.next(this.factionAssignment);
  }
}
