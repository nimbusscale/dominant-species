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
import { ActionFactoryService } from '../../../../app/game/service/action-factory.service';

describe('AdaptionActionDisplayService', () => {
  let adaptionActionDisplayService: AdaptionActionDisplayService;
  let testElements: ElementPiece[];
  let testArea: Area;
  let mockAreaRegistryService: jasmine.SpyObj<AreaRegistryService>;
  let mockElementDrawPoolService: jasmine.SpyObj<ElementDrawPoolService>;
  let mockActionFactoryService: jasmine.SpyObj<ActionFactoryService>;

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

    mockActionFactoryService = jasmine.createSpyObj('ActionFactoryService', [
      'buildPlaceActionPawnInSpace',
      'buildTakeElementFromSpace',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AdaptionActionDisplayService,
        { provide: AreaRegistryService, useValue: mockAreaRegistryService },
        { provide: ElementDrawPoolService, useValue: mockElementDrawPoolService },
        { provide: ActionFactoryService, useValue: mockActionFactoryService },
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
      adaptionActionDisplayService.elementSpaces$
        .pipe(
          filter((elements) => elements.every((space) => space.piece !== null)),
          first(), // Take only the first emission that satisfies the conditions
        )
        .subscribe((spaces) => {
          expect(spaces.map((space) => space.piece)).toEqual(testElements);
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

  describe('actionPawnSpaces$', () => {
    it('should emit space array when no action pawns', (done) => {
      adaptionActionDisplayService.actionPawnSpaces$.subscribe((spaces) => {
        expect(spaces.map((space) => space.piece)).toEqual([null, null, null]);
        done();
      });
    });
    it('should emit when piece added', (done) => {
      const actionPawn = defaultPieceFactory(PieceKindEnum.ACTION_PAWN) as ActionPawnPiece;

      // skip first value before placing actionPawn
      adaptionActionDisplayService.actionPawnSpaces$.pipe(skip(1)).subscribe((spaces) => {
        expect(spaces.map((space) => space.piece)).toEqual([actionPawn, null, null]);
        done();
      });
      adaptionActionDisplayService.actionPawnSpaces[0].addPiece(actionPawn);
    });
    it('should emit when piece removed', (done) => {
      const actionPawn = defaultPieceFactory(PieceKindEnum.ACTION_PAWN) as ActionPawnPiece;
      adaptionActionDisplayService.actionPawnSpaces[0].addPiece(actionPawn);
      // skip value with actionPawn
      adaptionActionDisplayService.actionPawnSpaces$.pipe(skip(1)).subscribe((spaces) => {
        expect(spaces.map((space) => space.piece)).toEqual([null, null, null]);
        done();
      });
      expect(adaptionActionDisplayService.actionPawnSpaces[0].removePiece()).toEqual(actionPawn);
    });
  });

  describe('elementSpaces$', () => {
    it('should emit when piece removed', (done) => {
      const element = defaultPieceFactory(ElementEnum.SUN) as ElementPiece;
      adaptionActionDisplayService.replenish();
      // skip value with element
      adaptionActionDisplayService.elementSpaces$.pipe(skip(1)).subscribe((spaces) => {
        expect(spaces.map((space) => space.piece)).toEqual([null, element, element, element]);
        done();
      });
      expect(adaptionActionDisplayService.elementSpaces[0].removePiece()).toEqual(element);
    });
  });
});
