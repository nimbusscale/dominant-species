import { Injectable } from '@angular/core';
import { AreaRegistryService } from '../../../engine/service/game-element/area-registry.service';
import { ElementDrawPoolService } from '../element-draw-pool.service';
import { Area } from '../../../engine/model/area.model';
import { ElementPiece } from '../../model/element.model';
import { ActionPawnPiece } from '../../model/action-pawn.model';
import {BehaviorSubject, combineLatestWith, filter, first} from 'rxjs';
import { AreaIdEnum, SpaceKindEnum } from '../../constant/area.constant';
import { ensureDefined } from '../../../engine/util/misc';
import { Piece } from '../../../engine/model/piece.model';
import { Space } from '../../../engine/model/space.model';
import { isNotNull } from '../../../engine/util/predicate';

@Injectable({
  providedIn: 'root',
})
export class AdaptionActionDisplayService {
  area: Area | undefined = undefined;
  actionPawnSpaces: Space[] = [];
  actionPawns: (ActionPawnPiece | null)[] = [];
  private actionPawnsSubject = new BehaviorSubject<(ActionPawnPiece | null)[]>(this.actionPawns);
  actionPawns$ = this.actionPawnsSubject.asObservable();
  elementSpaces: Space[] = [];
  elements: (ElementPiece | null)[] = [];
  private elementsSubject = new BehaviorSubject<(ElementPiece | null)[]>(this.elements);
  elements$ = this.elementsSubject.asObservable();
  private readySubject = new BehaviorSubject<boolean>(false);
  ready$ = this.readySubject.asObservable();

  constructor(
    private areaRegistryService: AreaRegistryService,
    private elementDrawPoolService: ElementDrawPoolService,
  ) {
    this.initialize();
  }

  initialize() {
    this.elementDrawPoolService.ready$
      .pipe(
        combineLatestWith(this.areaRegistryService.registeredIds$),
        filter(
          ([isReady, registeredAreaIds]) =>
            isReady && registeredAreaIds.has(AreaIdEnum.ACTION_DISPLAY_ADAPTION),
        ),
        first(),
      )
      .subscribe(() => {
        this.area = this.areaRegistryService.get(AreaIdEnum.ACTION_DISPLAY_ADAPTION);

        this.area.spaces$.subscribe((spaces) => {
          this.actionPawnSpaces = spaces.filter(
            (space) => (space.kind as SpaceKindEnum) === SpaceKindEnum.ACTION_PAWN,
          );
          this.actionPawns = this.actionPawnSpaces.map(
            (space) => space.piece,
          ) as (ActionPawnPiece | null)[];
          this.actionPawnsSubject.next(this.actionPawns);

          this.elementSpaces = spaces.filter(
            (space) => (space.kind as SpaceKindEnum) === SpaceKindEnum.ELEMENT,
          );
          this.elements = this.elementSpaces.map((space) => space.piece) as (ElementPiece | null)[];
          this.elementsSubject.next(this.elements);
          this.readySubject.next(true);
        });
      });
  }

  setup(): void {
    this.replenish();
  }

  replenish(): void {
    if (this.elements.filter(isNotNull).length > 0) {
      throw new Error('Element spaces must be cleared before replenish');
    }

    this.elementDrawPoolService.pull(4).forEach((element) => {
      const nextSpace = ensureDefined(this.area).nextAvailableSpace(SpaceKindEnum.ELEMENT);
      if (nextSpace) {
        nextSpace.addPiece(element as Piece);
      } else {
        throw new Error('No Spaces available');
      }
    });
    this.elementsSubject.next(this.elements);
  }

  removeElement(index: number): ElementPiece {
    return ensureDefined(this.elementSpaces)[index].removePiece() as ElementPiece;
  }

  removeRemainingElements(): ElementPiece[] {
    return ensureDefined(this.elementSpaces)
      .filter((space) => space.piece)
      .map((space) => space.removePiece() as ElementPiece);
  }

  addActionPawn(index: number, actionPawn: ActionPawnPiece): void {
    ensureDefined(this.actionPawnSpaces)[index].addPiece(actionPawn);
  }

  removeActionPawn(index: number): ActionPawnPiece {
    return ensureDefined(this.actionPawnSpaces)[index].removePiece() as ActionPawnPiece;
  }
}
