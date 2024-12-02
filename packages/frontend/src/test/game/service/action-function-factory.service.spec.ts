import { TestBed } from '@angular/core/testing';

import { ActionFunctionFactoryService } from '../../../app/game/service/action-function-factory.service';
import { AnimalProviderService } from '../../../app/game/service/animal-provider.service';
import { Space } from '../../../app/engine/model/space.model';
import { Animal, AnimalElements } from '../../../app/game/model/animal.model';
import { Pile } from '../../../app/engine/model/pile.model';
import { ActionContext } from '../../../app/engine/model/action.model';
import { ElementPiece } from '../../../app/game/model/element.model';
import { ActionPawnPiece } from '../../../app/game/model/action-pawn.model';

describe('ActionFunctionFactoryService', () => {
  let actionFunctionFactoryService: ActionFunctionFactoryService;
  let testActionFunction: () => ActionContext | null;
  let testActionContext: ActionContext;
  let mockActionPawn: jasmine.SpyObj<ActionPawnPiece>;
  let mockActionPawnPile: jasmine.SpyObj<Pile>;
  let mockElement: jasmine.SpyObj<ElementPiece>;
  let mockAnimalElements: jasmine.SpyObj<AnimalElements>;
  let mockSpace: jasmine.SpyObj<Space>;
  let mockAnimal: jasmine.SpyObj<Animal>;
  let mockAnimalProviderService: jasmine.SpyObj<AnimalProviderService>;

  beforeEach(() => {
    testActionContext = {
      actionId: 'testAction',
      currentPlayerFactionId: 'testFaction',
    };

    mockActionPawn = jasmine.createSpyObj('Piece', ['kind', 'owner']);
    mockActionPawnPile = jasmine.createSpyObj('ActionPawnPile', ['pullOne']);
    mockActionPawnPile.pullOne.and.returnValue(mockActionPawn);

    mockElement = jasmine.createSpyObj('Piece', [], {
      kind: 'grass',
    });
    mockAnimalElements = jasmine.createSpyObj('AnimalElements', ['addElement']);

    mockSpace = jasmine.createSpyObj('Space', ['addPiece', 'removePiece']);
    mockSpace.removePiece.and.returnValue(mockElement);

    mockAnimal = jasmine.createSpyObj('Animal', [], {
      actionPawn: mockActionPawnPile,
      elements: mockAnimalElements,
    });

    mockAnimalProviderService = jasmine.createSpyObj('AnimalProviderService', {
      get: mockAnimal,
    });

    TestBed.configureTestingModule({
      providers: [
        ActionFunctionFactoryService,
        { provide: AnimalProviderService, useValue: mockAnimalProviderService },
      ],
    });
    actionFunctionFactoryService = TestBed.inject(ActionFunctionFactoryService);
  });

  it('should be created', () => {
    expect(actionFunctionFactoryService).toBeTruthy();
  });

  describe('PlaceActionPawnInSpace', () => {
    beforeEach(() => {
      testActionFunction = actionFunctionFactoryService.buildPlaceActionPawnInSpace(
        testActionContext,
        mockSpace,
      );
    });

    it('Adds Action Pawn to Space', () => {
      const result = testActionFunction();
      expect(result).toBeTruthy();
      expect(mockSpace.addPiece).toHaveBeenCalledWith(mockActionPawn);
    });
    it('Throws Error if Animal Has No Action Pawns', () => {
      mockActionPawnPile.pullOne.and.returnValue(null);
      expect(() => {
        testActionFunction();
      }).toThrowError();
    });
  });
  describe('TakeElementFromSpace', () => {
    beforeEach(() => {
      testActionFunction = actionFunctionFactoryService.buildTakeElementFromSpace(
        testActionContext,
        mockSpace,
      );
    });

    it('Removes Element from Space and Adds it to Animal', () => {
      const result = testActionFunction();
      expect(result).toBeNull();
      expect(mockAnimalElements.addElement).toHaveBeenCalledWith(mockElement);
    });
  });
});
