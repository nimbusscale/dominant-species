import { GameStateStoreService } from './game-state-store.service';
import { filter, skip } from 'rxjs';
import {GameState} from "../model/game-state.model";

describe('GameStateStore', () => {
  let testGameState: GameState;
  let newGameState: GameState
  let gameStateStore: GameStateStoreService;

  beforeEach(() => {
    testGameState = {
      pile: [
        {
          kind: 'pile1',
          inventory: { test1: 10, test2: 10 },
        },
        {
          kind: 'pile2',
          inventory: { test3: 10 },
        },
      ],
      faction: [
        {
          owner: {
            id: 'test1',
            name: 'Tester1',
          },
          kind: 'redTester',
        },
        {
          owner: {
            id: 'test2',
            name: 'Tester2',
          },
          kind: 'blueTester',
        },
      ],
    };
    newGameState = JSON.parse(JSON.stringify(testGameState))
    newGameState.pile[0].inventory['test1'] = 20
    gameStateStore = new GameStateStoreService(testGameState);
  });

  describe('state observable', () => {
    it('$faction should emit state', (done) => {
      gameStateStore.faction$().subscribe((emittedState) => {
        expect(emittedState).toBe(testGameState.faction);
        done();
      });
    });
    it('$pile should emit state', (done) => {
      gameStateStore.pile$().subscribe((emittedState) => {
        expect(emittedState).toBe(testGameState.pile);
        done();
      });
    });
  })
  describe('transaction', () => {
    it('emits update state when commit', (done) => {
      gameStateStore
        .pile$()
        .pipe(skip(1)) // Skip the initial state
        .subscribe((emittedState) => {
          expect(emittedState[0]).toEqual(newGameState.pile[0]);
          done();
        });

      gameStateStore.startTransaction()
      gameStateStore.setPile(newGameState.pile[0])
      gameStateStore.commitTransaction()
    })
    it('emits original state when rollback', (done) => {
      gameStateStore
        .pile$()
        .pipe(skip(1)) // Skip the initial state
        .subscribe((emittedState) => {
          expect(emittedState[0]).toEqual(testGameState.pile[0]);
          done();
        });

      gameStateStore.startTransaction()
      gameStateStore.setPile(newGameState.pile[0])
      gameStateStore.rollbackTransaction()
    })
    it('throws error if update without transaction', () => {
      expect(() => {
        gameStateStore.setPile(newGameState.pile[0])
      }).toThrowError()
    })
    it('throws error if start transaction, when one is already started', () => {
      gameStateStore.startTransaction()
      expect(() => {
        gameStateStore.startTransaction()
      }).toThrowError()
    })
    it('throws error if commit without transaction', () => {
      expect(() => {
        gameStateStore.commitTransaction()
      }).toThrowError()
    })
    it('throws error if rollback without transaction', () => {
      expect(() => {
        gameStateStore.rollbackTransaction()
      }).toThrowError()
    })
  })


});
