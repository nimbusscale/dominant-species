import { Injectable } from '@angular/core';
import { PlayerService } from '../../engine/service/player.service';
import { Faction } from '../../engine/model/faction.model';
import { Area } from '../../engine/model/area.model';
import { AreaRegistryService } from '../../engine/service/game-element/area-registry.service';
import {
  FactionAssignment,
  FactionRegistryService,
} from '../../engine/service/game-element/faction-registry.service';
import { BehaviorSubject, filter, first, map } from 'rxjs';
import { elementConfigByAnimal, ElementConfig } from '../dominant-species.constants';
import { getOrThrow } from '../../engine/util';
import { isNotNull, isNotUndefined } from '../../engine/predicate';
import { Space } from '../../engine/model/space.model';
import { ElementPiece } from '../model/piece.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private faction: Faction | undefined = undefined;
  private elementConfig: ElementConfig | undefined = undefined;
  private elementArea: Area | undefined = undefined;
  private elementSpaces: Space[] | undefined = undefined;
  private elementsSpacesSubject: BehaviorSubject<Space[] | undefined> = new BehaviorSubject<
    Space[] | undefined
  >(this.elementSpaces);
  elementSpaces$ = this.elementsSpacesSubject.asObservable();

  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private factionRegistryService: FactionRegistryService,
    private playerService: PlayerService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.factionAssignmentSubscription();
  }

  private factionAssignmentSubscription(): void {
    this.factionRegistryService.factionAssignment$
      .pipe(
        map((factionAssignments) =>
          factionAssignments.find(
            (factionAssignment) =>
              factionAssignment.ownerId === this.playerService.currentPlayer.id,
          ),
        ),
        filter((factionAssignment): factionAssignment is FactionAssignment =>
          isNotUndefined(factionAssignment),
        ),
        first(),
      )
      .subscribe((factionAssignment) => {
        this.faction = this.factionRegistryService.get(factionAssignment.id);
        this.registeredAreaSubscription();
      });
  }

  private registeredAreaSubscription(): void {
    /*
    Defining elementConfig in local scope so that TS can track value is being set.
    Using this.elementConfig means TS thinks it could be undefined
    */
    const elementConfig = getOrThrow(elementConfigByAnimal, this.faction?.id);
    this.elementConfig = elementConfig;
    this.areaRegistrySvc.registeredIds$
      .pipe(
        filter((registeredIds) => registeredIds.has(elementConfig.areaId)),
        first(),
      )
      .subscribe(() => {
        this.elementArea = this.areaRegistrySvc.get(elementConfig.areaId);
        this.elementSpaces = this.elementArea.spaces;
        this.elementsSpacesSubject.next(this.elementSpaces);
      });
  }

  get id(): string | undefined {
    return this.faction ? this.faction.id : undefined;
  }

  get elements(): ElementPiece[] | undefined {
    return this.elementSpaces?.map((space) => space.piece as ElementPiece).filter(isNotNull);
  }

  private get addedElementSpaces(): Space[] | undefined {
    const elementSpaces = this.elementSpaces;
    if (elementSpaces && this.elementConfig) {
      if (elementSpaces.length > this.elementConfig.inherentCount) {
        return elementSpaces.slice(this.elementConfig.inherentCount);
      } else {
        return [];
      }
    } else {
      return undefined;
    }
  }

  get addedElements(): ElementPiece[] {
    if (this.addedElementSpaces) {
      return this.addedElementSpaces.map((space) => space.piece as ElementPiece).filter(isNotNull);
    } else {
      throw new Error('Animal not initialized yet');
    }
  }

  addElement(element: ElementPiece): void {
    if (this.elementArea) {
      const availableSpace = this.elementArea.nextAvailableSpace();
      if (availableSpace) {
        availableSpace.addPiece(element);
        this.elementsSpacesSubject.next(this.elementSpaces);
      } else {
        throw new Error('No available element spaces');
      }
    } else {
      throw new Error('Animal not initialized yet');
    }
  }

  removeElement(element: ElementPiece): void {
    if (this.addedElementSpaces) {
      const elementSpace = this.addedElementSpaces.find(
        (space) => space.piece && space.piece.kind === element.kind,
      );
      if (elementSpace) {
        elementSpace.removePiece();
        this.elementsSpacesSubject.next(this.elementSpaces);
      } else {
        throw new Error(`Animal does not have added element ${JSON.stringify(element)}`);
      }
    } else {
      throw new Error('Animal not initialized yet');
    }
  }
}
