import { TestBed } from '@angular/core/testing';

import { PileStateService } from '../../../app/engine/service/pile-state.service';
import {BehaviorSubject} from "rxjs";
import {Pile, PileState} from "../../../app/engine/model/pile.model";
import {deepClone} from "fast-json-patch";
import {testPileState1, testPileState2} from "./game-state-test.constant";
import {GameStateService} from "../../../app/engine/service/game-state.service";

describe('PileStateService', () => {
  let pileStateSvc: PileStateService;
  let gameStateSvcSpy: jasmine.SpyObj<GameStateService>;
  let gameStatePileSubject: BehaviorSubject<PileState[]>;
  let testPile1: Pile;
  let testPile2: Pile;

  beforeEach(() => {
    gameStatePileSubject = new BehaviorSubject<PileState[]>([]);
    const gameStateSvcSpyObj = jasmine.createSpyObj(
      'GameStateService',
      ['registerPile', 'setPile'],
      {
        pile$: gameStatePileSubject.asObservable(),
      },
    );

    // These probably should be mocks /
    testPile1 = new Pile(deepClone(testPileState1) as PileState);
    testPile2 = new Pile(deepClone(testPileState2) as PileState);

    TestBed.configureTestingModule({
      providers: [PileStateService, { provide: GameStateService, useValue: gameStateSvcSpyObj }],
    });

    pileStateSvc = TestBed.inject(PileStateService);
    gameStateSvcSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
  });

  describe('register', () => {
    it('should allow registration of new piles', () => {
      pileStateSvc.register([testPile1, testPile2]);
      // once for each pile
      expect(gameStateSvcSpy.registerPile).toHaveBeenCalledTimes(2);
      // We want to skip the first state update since we just registered and not in a transaction
      expect(gameStateSvcSpy.setPile).not.toHaveBeenCalled()
    })
    it('show throw error if registering already registered pile', () => {
      pileStateSvc.register([testPile1, testPile2]);
      expect(() => {pileStateSvc.register([testPile1])}).toThrowError()
    })
  })
  describe('pile state sync', () => {
    beforeEach(() => {
      pileStateSvc.register([testPile1])
    })
    it('should update GameState when PileState Updated', () => {
      testPile1.pull()
      expect(gameStateSvcSpy.setPile).toHaveBeenCalledWith(testPile1.state)
    })
    it('should update PileState when GameState Updated', () => {
      const updatedGameState = deepClone(testPileState1) as PileState
      updatedGameState.inventory['test1'] = 0
      gameStatePileSubject.next([updatedGameState])
      expect(testPile1.state.inventory['test1']).toEqual(0)
    })
  })

});
