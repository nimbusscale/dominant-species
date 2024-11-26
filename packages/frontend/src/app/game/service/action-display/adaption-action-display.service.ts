import { Injectable } from '@angular/core';
import { AreaRegistryService } from '../../../engine/service/game-element/area-registry.service';
import { ElementDrawPoolService } from '../element-draw-pool.service';
import { Area } from '../../../engine/model/area.model';
import { ElementPiece } from '../../model/element.model';
import { ActionPawnPiece } from '../../model/action-pawn.model';
import { BehaviorSubject, combineLatestWith, filter, first } from 'rxjs';
import { AreaIdEnum, SpaceKindEnum } from '../../constant/area.constant';
import { ensureDefined } from '../../../engine/util/misc';
import { Space } from '../../../engine/model/space.model';
import { isNotNull } from '../../../engine/util/predicate';
import { Piece } from 'api-types/src/game-state';
import {Action, ActionCompleteCallback, ActionContext} from "../../../engine/model/action.model";
import {ActionFactoryService} from "../action-factory.service";
import {ActionIdEnum} from "../../constant/action.constant";

@Injectable({
  providedIn: 'root',
})
export class AdaptionActionDisplayService {
  area: Area | undefined = undefined;
  actionPawnSpaces: Space[] = [];
  private actionPawnsSpacesSubject = new BehaviorSubject<Space[]>(this.actionPawnSpaces);
  actionPawnSpaces$ = this.actionPawnsSpacesSubject.asObservable()
  // An array of spaces that can hold Element pieces
  elementSpaces: Space[] = [];
  // An array of pieces in each elementSpaces. If there is no element in a space, then the value is null
  elements: (ElementPiece | null)[] = [];
  private elementsSubject = new BehaviorSubject<(ElementPiece | null)[]>(this.elements);
  elements$ = this.elementsSubject.asObservable();
  private readySubject = new BehaviorSubject<boolean>(false);
  ready$ = this.readySubject.asObservable();

  constructor(
    private areaRegistryService: AreaRegistryService,
    private actionFactoryService: ActionFactoryService,
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
          this.actionPawnsSpacesSubject.next(this.actionPawnSpaces)

          this.elementSpaces = spaces.filter(
            (space) => (space.kind as SpaceKindEnum) === SpaceKindEnum.ELEMENT,
          );
          this.elements = this.elementSpaces.map((space) => space.piece) as (ElementPiece | null)[];
          this.elementsSubject.next(this.elements);
          this.readySubject.next(true);
        });
      });
  }

  replenish(): void {
    if (this.elements.filter(isNotNull).length > 0) {
      throw new Error('Element spaces must be cleared before replenish');
    }

    this.elementDrawPoolService.pull(4).forEach((element) => {
      if (element) {
        const nextSpace = ensureDefined(this.area).nextAvailableSpace(SpaceKindEnum.ELEMENT);
        if (nextSpace) {
          nextSpace.addPiece(element as Piece);
        } else {
          throw new Error('No Spaces available');
        }
      }
    });
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

  buildActions(actionContext: ActionContext, callback: ActionCompleteCallback): void {
    if (actionContext.actionId === ActionIdEnum.PLACE_ACTION_PAWN) {
      this.actionPawnSpaces.filter((space) => space.piece === null).forEach((space) => {
        const action = new Action(
          actionContext,
          this.actionFactoryService.buildPlaceActionPawnInSpace(actionContext, space),
          callback
        )
        space.setActions([action])
      })
    } else if (actionContext.actionId === ActionIdEnum.TAKE_ELEMENT) {
      this.elementSpaces.filter((space) => space.piece).forEach((space) => {
        const action = new Action(
          actionContext,
          this.actionFactoryService.buildTakeElementFromSpace(actionContext, space),
          callback
        )
        space.setActions([action])
      })
    }
  }

  clearActions(): void {
    ensureDefined(this.area).clearActions()
  }
}
