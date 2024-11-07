import { TestBed } from '@angular/core/testing';

import { AdaptionActionDisplayService } from '../../../../app/game/service/action-display/adaption-action-display.service';
import { AreaRegistryService } from '../../../../app/engine/service/game-element/area-registry.service';
import { ElementDrawPoolService } from '../../../../app/game/service/element-draw-pool.service';
import { AreaIdEnum } from '../../../../app/game/constant/area.constant';
import { filter, first, of, skip } from 'rxjs';
import { Area } from '../../../../app/engine/model/area.model';
import { defaultPieceFactory } from '../../../../app/engine/model/piece.model';
import { ElementEnum } from '../../../../app/game/constant/element.constant';
import { ElementPiece } from '../../../../app/game/model/element.model';
import { PieceKindEnum } from '../../../../app/game/constant/piece.constant';
import { ActionPawnPiece } from '../../../../app/game/model/action-pawn.model';
import { deepClone } from 'fast-json-patch';
import { ACTION_DISPLAY_ADAPTION_STATE } from '../../../../app/game/constant/game-state.constant';
import { AreaState } from 'api-types/src/game-state';

describe('AdaptionActionDisplayService', () => {
  let adaptionActionDisplayService: AdaptionActionDisplayService;
  let testElements: ElementPiece[];
  let testArea: Area;
  let mockAreaRegistryService: jasmine.SpyObj<AreaRegistryService>;
  let mockElementDrawPoolService: jasmine.SpyObj<ElementDrawPoolService>;

  beforeEach(() => {
    testArea = new Area(deepClone(ACTION_DISPLAY_ADAPTION_STATE) as AreaState);
    mockAreaRegistryService = jasmine.createSpyObj('AreaRegistryService', ['get'], {
      registeredIds$: of(new Set<string>([AreaIdEnum.ACTION_DISPLAY_ADAPTION])),
    });
    mockAreaRegistryService.get.and.returnValue(testArea);

    testElements = [
      defaultPieceFactory(ElementEnum.SUN),
      defaultPieceFactory(ElementEnum.SUN),
      defaultPieceFactory(ElementEnum.SUN),
      defaultPieceFactory(ElementEnum.SUN),
    ] as ElementPiece[];
    mockElementDrawPoolService = jasmine.createSpyObj('ElementDrawPoolService', ['pull'], {
      ready$: of(true),
    });
    mockElementDrawPoolService.pull.and.returnValue(testElements);

    TestBed.configureTestingModule({
      providers: [
        AdaptionActionDisplayService,
        { provide: AreaRegistryService, useValue: mockAreaRegistryService },
        { provide: ElementDrawPoolService, useValue: mockElementDrawPoolService },
      ],
    });
    adaptionActionDisplayService = TestBed.inject(AdaptionActionDisplayService);
  });

  describe('ready$', () => {
    it('should be ready when dependencies are ready', (done) => {
      adaptionActionDisplayService.ready$.subscribe((ready) => {
        expect(ready).toBeTrue();
        done();
      });
    });
  });

  describe('setup/replenish', () => {
    it('should add 4 elements and emit', (done) => {
      adaptionActionDisplayService.elements$
        .pipe(
          filter((elements) => elements.every((item) => item !== null)),
          first(), // Take only the first emission that satisfies the conditions
        )
        .subscribe((elements) => {
          expect(elements).toEqual(testElements);
          done();
        });

      adaptionActionDisplayService.replenish();
    });
    it('should throw error if replenish and spaces not cleared', () => {
      adaptionActionDisplayService.elementSpaces[0].addPiece(defaultPieceFactory(ElementEnum.SUN));
      expect(() => {
        adaptionActionDisplayService.replenish();
      }).toThrowError();
    });
  });

  describe('actionPawns', () => {
    it('actionPawns$ should emit null array when no action pawns', (done) => {
      adaptionActionDisplayService.actionPawns$.subscribe((actionPawns) => {
        expect(actionPawns[0]).toBeNull();
        done();
      });
    });
    it('Should be able to add actionPawn', (done) => {
      const actionPawn = defaultPieceFactory(PieceKindEnum.ACTION_PAWN) as ActionPawnPiece;

      // skip first value before placing actionPawn
      adaptionActionDisplayService.actionPawns$.pipe(skip(1)).subscribe((actionPawns) => {
        expect(actionPawns[0]).toEqual(actionPawn);
        done();
      });
      adaptionActionDisplayService.addActionPawn(0, actionPawn);
    });
    it('should be able to remove actionPawn', (done) => {
      const actionPawn = defaultPieceFactory(PieceKindEnum.ACTION_PAWN) as ActionPawnPiece;
      adaptionActionDisplayService.addActionPawn(0, actionPawn);
      // skip value with actionPawn
      adaptionActionDisplayService.actionPawns$.pipe(skip(1)).subscribe((actionPawns) => {
        expect(actionPawns[0]).toBeNull();
        done();
      });
      expect(adaptionActionDisplayService.removeActionPawn(0));
    });
  });

  describe('elements', () => {
    it('should allow remove element', () => {
      adaptionActionDisplayService.elementSpaces[0].addPiece(defaultPieceFactory(ElementEnum.SUN));
      expect(adaptionActionDisplayService.removeElement(0)).toEqual(
        defaultPieceFactory(ElementEnum.SUN) as ElementPiece,
      );
    });
    it('should allow removeRemainingElements', () => {
      // adds the testElements to the spaces /
      adaptionActionDisplayService.replenish();
      expect(adaptionActionDisplayService.removeRemainingElements()).toEqual(testElements);
    });
  });
});
