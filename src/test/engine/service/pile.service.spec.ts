import { TestBed } from '@angular/core/testing';
import {BehaviorSubject, combineLatest, skip} from 'rxjs';
import {PileService} from "../../../app/engine/service/pile.service";
import {GameStateService} from "../../../app/engine/service/game-state.service";
import {Pile, PileState} from "../../../app/engine/model/pile.model";
import {testPileState1, testPileState2} from "./game-state-test.constant";
import {deepClone} from "fast-json-patch";

describe('PileService', () => {
  let pileService: PileService;
  let gameStateSvcSpy: jasmine.SpyObj<GameStateService>;
  let gameStatePileSubject: BehaviorSubject<any[]>
  let testPile1: Pile
  let testPile2: Pile



  beforeEach(() => {
    gameStatePileSubject = new BehaviorSubject<any[]>([]);
    const gameStateSvcSpyObj = jasmine.createSpyObj('GameStateService', ['setPile', 'requireTransaction'],
      {
        pile$: gameStatePileSubject.asObservable()
      });

    testPile1 = new Pile(deepClone(testPileState1))
    testPile2 = new Pile(deepClone(testPileState2))


    TestBed.configureTestingModule({
      providers: [
        PileService,
        { provide: GameStateService, useValue: gameStateSvcSpyObj }
      ]
    });

    pileService = TestBed.inject(PileService);
    gameStateSvcSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
  });

  describe('register', () => {
    it('allows registration of new piles and updates GameState', () => {
      pileService.register([testPile1, testPile2])
      expect(gameStateSvcSpy.setPile).toHaveBeenCalled()
    })
    it('emits to kindToLengthSubjects', (done) => {
      pileService.register([testPile1, testPile2])
      pileService.registeredPiles$.subscribe((piles) => {
        expect(piles.has('pile1')).toBeTrue()
        expect(piles.has('pile2')).toBeTrue()
        done()
      })
    })
    it('emits length of newly registered piles', (done) => {
      pileService.register([testPile1, testPile2])
      const pile1LengthObservable = pileService.kindToLengthObservables.get('pile1');
      const pile2LengthObservable = pileService.kindToLengthObservables.get('pile2');

      expect(pile1LengthObservable).toBeDefined();
      expect(pile2LengthObservable).toBeDefined();

      if (pile1LengthObservable && pile2LengthObservable) {
        combineLatest([pile1LengthObservable, pile2LengthObservable]).subscribe(
        ([pile1Length, pile2Length]) => {
        expect(pile1Length).toEqual(20)
        expect(pile2Length).toEqual(10)
        done()
      })
      }
    })
    it('throws error when pile already registered', () => {
      pileService.register([testPile1, testPile2])
      expect(() => {pileService.register([testPile1])}).toThrowError()
    })
  })
  describe('pull', () => {
    it('pulls items from registered pile and updates GameState', () => {
      pileService.register([testPile1])
      expect(pileService.pull('pile1')).toBeTruthy()
      expect(gameStateSvcSpy.requireTransaction).toHaveBeenCalled()
      expect(gameStateSvcSpy.setPile).toHaveBeenCalled()
    })
    it('emits updated length after pull', (done) => {
      pileService.register([testPile1])
      const pile1LengthObservable = pileService.kindToLengthObservables.get('pile1');
      expect(pile1LengthObservable).toBeDefined();
      if (pile1LengthObservable) {
        pile1LengthObservable.pipe(skip(1)).subscribe((length) => {
          expect(length).toBe(testPile1.length)
        })
        done()
      }
      pileService.pull('pile1')
    })
    it('throws error if pulled from unregistered pie', () => {
      pileService.register([testPile1])
      expect(() => {pileService.pull('pile2')}).toThrowError()
    })
  })
  describe('put', () => {
    it('puts items from registered pile and updates GameState', () => {
      pileService.register([testPile1])
      pileService.put('pile1', [{kind: 'test1'}])
      expect(gameStateSvcSpy.requireTransaction).toHaveBeenCalled()
      expect(gameStateSvcSpy.setPile).toHaveBeenCalled()
    })
  })
  it('emits updated length after put', (done) => {
      pileService.register([testPile1])
      const pile1LengthObservable = pileService.kindToLengthObservables.get('pile1');
      expect(pile1LengthObservable).toBeDefined();
      if (pile1LengthObservable) {
        pile1LengthObservable.pipe(skip(1)).subscribe((length) => {
          expect(length).toBe(testPile1.length)
          done()
        })
      }
      pileService.put('pile1', [{kind: 'test1'}])
    })
  it('throws error if pulled from unregistered pie', () => {
      pileService.register([testPile1])
      expect(() => {pileService.put('pile2', [{kind: 'test1'}])}).toThrowError()
    })
  describe('Updates from GameState', () => {
    it('updates local state and emits length', (done) => {
      pileService.register([testPile1])
      const pile1LengthObservable = pileService.kindToLengthObservables.get('pile1');
      if (pile1LengthObservable) {
        pile1LengthObservable.pipe(skip(1)).subscribe((length) => {
          expect(length).toBe(testPile1.length)
          done()
        })
      }
      const updatedTestPile1: PileState = deepClone(testPileState1)
      updatedTestPile1.inventory['test1'] = 0
      gameStatePileSubject.next([updatedTestPile1])
    })
  })

});
