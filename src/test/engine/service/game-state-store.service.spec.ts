import { GameStateStoreService } from '../../../app/engine/service/game-state-store.service';
import { skip } from 'rxjs';
import { testGameState1, testGameState1updated } from './game-state-test.constant';

describe('GameStateStore', () => {
  let gameStateStore: GameStateStoreService;

  beforeEach(() => {
    gameStateStore = new GameStateStoreService();
  });
  describe('when not initialized', () => {
    it('initializes', () => {
      gameStateStore.initializeGameState(testGameState1);
      expect(gameStateStore.gameState).toEqual(testGameState1);
    });
    it('Throws error when trying to initialize an already initialized GameState', () => {
      gameStateStore.initializeGameState(testGameState1);
      expect(() => {
        gameStateStore.initializeGameState(testGameState1);
      }).toThrowError();
    });
    it('Throws error when trying to set GameState when not initialized', () => {
      expect(() => {
        gameStateStore.setGameState(testGameState1updated);
      }).toThrowError();
    });
  });
  describe('when initialized', () => {
    beforeEach(() => {
      gameStateStore.initializeGameState(testGameState1);
    });
    describe('state observable', () => {
      // All state observables are wrappers around the same code path so just testing one should be sufficient for unit test.
      it('$pile should emit a copy of state', (done) => {
        gameStateStore.pile$.subscribe((emittedState) => {
          expect(emittedState).toEqual(testGameState1.pile);
          expect(emittedState).not.toBe(testGameState1.pile);
          done();
        });
      });
    });
    describe('state properties', () => {
      it('gameState should return a copy of current game state', () => {
        const gameStateCopy = gameStateStore.gameState;
        expect(gameStateCopy).toEqual(testGameState1);
        expect(gameStateCopy).not.toBe(testGameState1);
      });
      it('transactionState should return a copy of transaction game state when transaction', () => {
        gameStateStore.startTransaction();
        expect(gameStateStore.transactionState).toEqual(testGameState1);
        expect(gameStateStore.transactionState).not.toBe(testGameState1);
      });
      it('transactionState should return null when no transaction', () => {
        expect(gameStateStore.transactionState).toBe(null);
      });
    });
    describe('gameState', () => {
      it('can be retrieved', () => {
        expect(gameStateStore.gameState).toEqual(testGameState1);
      });
      it('can be set', () => {
        gameStateStore.setGameState(testGameState1updated);
        expect(gameStateStore.gameState).toEqual(testGameState1updated);
      });
      it('throws error when set during a transaction', () => {
        gameStateStore.startTransaction();
        expect(() => {
          gameStateStore.setGameState(testGameState1updated);
        }).toThrowError();
      });
    });
    describe('transaction', () => {
      it('emits update state when commit', (done) => {
        gameStateStore.pile$
          .pipe(skip(1)) // Skip the initial state
          .subscribe((emittedState) => {
            expect(emittedState[0]).toEqual(testGameState1updated.pile[0]);
            done();
          });

        gameStateStore.startTransaction();
        gameStateStore.setPile(testGameState1updated.pile[0]);
        gameStateStore.commitTransaction();
      });
      it('emits original state when rollback', (done) => {
        gameStateStore.pile$
          .pipe(skip(1)) // Skip the initial state
          .subscribe((emittedState) => {
            expect(emittedState[0]).toEqual(testGameState1.pile[0]);
            done();
          });

        gameStateStore.startTransaction();
        gameStateStore.setPile(testGameState1updated.pile[0]);
        gameStateStore.rollbackTransaction();
      });
      it('throws error if update without transaction', () => {
        expect(() => {
          gameStateStore.setPile(testGameState1updated.pile[0]);
        }).toThrowError();
      });
      it('throws error if start transaction, when one is already started', () => {
        gameStateStore.startTransaction();
        expect(() => {
          gameStateStore.startTransaction();
        }).toThrowError();
      });
      it('throws error if commit without transaction', () => {
        expect(() => {
          gameStateStore.commitTransaction();
        }).toThrowError();
      });
      it('throws error if rollback without transaction', () => {
        expect(() => {
          gameStateStore.rollbackTransaction();
        }).toThrowError();
      });
    });
  });
});
