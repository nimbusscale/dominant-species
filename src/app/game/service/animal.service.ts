import { Injectable } from '@angular/core';
import {PlayerService} from "../../engine/service/player.service";
import {Faction} from "../../engine/model/faction.model";
import {Area} from "../../engine/model/area.model";
import {AreaRegistryService} from "../../engine/service/game-element/area-registry.service";
import {FactionAssignment, FactionRegistryService} from "../../engine/service/game-element/faction-registry.service";
import {BehaviorSubject, filter, find, map} from "rxjs";
import {AnimalEnum, PieceKindEnum, elementConfigByAnimal, ElementType} from "../dominant-species.constants";
import {getOrThrow} from "../../engine/util";
import {isNotNull, isNotUndefined} from "../../engine/predicate";
import {Space} from "../../engine/model/space.model";
import {Piece} from "../../engine/model/piece.model";
import {ElementPiece} from "../model/piece.model";

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private faction: Faction | undefined = undefined
  private elementArea: Area | undefined = undefined
  private elementSpaces: Space[] | undefined = undefined
  private elementsSubject: BehaviorSubject<Space[] | undefined> = new BehaviorSubject(this.elementSpaces)
  private elements$ = this.elementsSubject.asObservable()

  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private factionRegistryService: FactionRegistryService,
    private playerService: PlayerService
  ) {
    this.initialize()
  }

  private initialize(): void {
    const factionAssignmentSubscription = this.factionRegistryService.factionAssignment$
      .pipe(
        map((factionAssignments) => factionAssignments.find(
          (factionAssignment) => factionAssignment.ownerId === this.playerService.currentPlayer.id)),
        filter((factionAssignment): factionAssignment is FactionAssignment => isNotUndefined(factionAssignment))
      )
      .subscribe((factionAssignment) => {
        this.faction = this.factionRegistryService.get(factionAssignment.id)
        factionAssignmentSubscription.unsubscribe();

        const elementConfig = getOrThrow(elementConfigByAnimal, this.faction.id)
        const registeredAreasSubscription = this.areaRegistrySvc.registeredIds$
        .pipe(filter((registeredIds) => registeredIds.has(elementConfig.areaId)))
        .subscribe(() => {
          this.elementArea = this.areaRegistrySvc.get(elementConfig.areaId)
          this.elementSpaces = this.elementArea.spaces
          this.elementsSubject.next(this.elementSpaces)
          registeredAreasSubscription.unsubscribe();
        });
      });
  }

  get id(): string | undefined {
    return this.faction ? this.faction.id : undefined
  }

  get elements(): ElementPiece[] | undefined {
    return this.elementSpaces?.map((space) => space.piece as ElementPiece).filter(isNotNull)
  }

  addElement(element: ElementPiece): void {
    if (this.elementArea && this.elements) {
        const availableSpace = this.elementArea.nextAvailableSpace()
        if (availableSpace) {
          availableSpace.addPiece(element)
        } else {
          throw new Error('No available element spaces')
        }
    } else {
      throw new Error("Animal not initialized yet")
    }
  }

}
