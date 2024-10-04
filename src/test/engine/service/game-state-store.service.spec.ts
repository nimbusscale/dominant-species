import { GameStateStoreService } from '../../../app/engine/service/game-state-store.service';
import { skip } from 'rxjs';
import { GameState } from '../../../app/engine/model/game-state.model';

describe('GameStateStore', () => {
  let testGameState: GameState;
  let newGameState: GameState;
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
    newGameState = JSON.parse(JSON.stringify(testGameState)) as GameState;
    newGameState.pile[0].inventory['test1'] = 20;
    gameStateStore = new GameStateStoreService();
  });
  describe('when not initialized', () => {
    it('initializes', () => {
      gameStateStore.initializeGameState(testGameState)
      expect(gameStateStore.gameState).toEqual(testGameState)
    })
    it('Throws error when trying to initialize an already initialized GameState', () => {
      gameStateStore.initializeGameState(testGameState)
      expect(() => {gameStateStore.initializeGameState(testGameState)}).toThrowError()
    })
    it('Throws error when trying to set GameState when not initialized', () => {
      expect(() => {gameStateStore.setGameState(newGameState)}).toThrowError()
    })
  })
  describe('when initialized', () => {
    beforeEach(() => {
      gameStateStore.initializeGameState(testGameState)
    })
    describe('state observable', () => {
      it('$faction should emit state', (done) => {
        gameStateStore.faction$.subscribe((emittedState) => {
          expect(emittedState).toBe(testGameState.faction);
          done();
        });
      });
      it('$pile should emit state', (done) => {
        gameStateStore.pile$.subscribe((emittedState) => {
          expect(emittedState).toBe(testGameState.pile);
          done();
        });
      });
    });
    describe('state properties', () => {
      it('gameState should return a copy of current game state', () => {
        const gameStateCopy = gameStateStore.gameState;
        expect(gameStateCopy).toEqual(testGameState);
        expect(gameStateCopy).not.toBe(testGameState);
      });
      it('transactionState should return a copy of transaction game state when transaction', () => {
        gameStateStore.startTransaction();
        expect(gameStateStore.transactionState).toEqual(testGameState);
        expect(gameStateStore.transactionState).not.toBe(testGameState);
      });
      it('transactionState should return null when no transaction', () => {
        expect(gameStateStore.transactionState).toBe(null);
      });
    });
    describe('gameState', () => {
      it('can be retrieved', () => {
        expect(gameStateStore.gameState).toEqual(testGameState);
      });
      it('can be set', () => {
        gameStateStore.setGameState(newGameState);
        expect(gameStateStore.gameState).toEqual(newGameState);
      });
      it('throws error when set during a transaction', () => {
        gameStateStore.startTransaction();
        expect(() => {
          gameStateStore.setGameState(newGameState);
        }).toThrowError();
      });
    });
    describe('transaction', () => {
      it('emits update state when commit', (done) => {
        gameStateStore.pile$
          .pipe(skip(1)) // Skip the initial state
          .subscribe((emittedState) => {
            expect(emittedState[0]).toEqual(newGameState.pile[0]);
            done();
          });

        gameStateStore.startTransaction();
        gameStateStore.setPile(newGameState.pile[0]);
        gameStateStore.commitTransaction();
      });
      it('emits original state when rollback', (done) => {
        gameStateStore.pile$
          .pipe(skip(1)) // Skip the initial state
          .subscribe((emittedState) => {
            expect(emittedState[0]).toEqual(testGameState.pile[0]);
            done();
          });

        gameStateStore.startTransaction();
        gameStateStore.setPile(newGameState.pile[0]);
        gameStateStore.rollbackTransaction();
      });
      it('throws error if update without transaction', () => {
        expect(() => {
          gameStateStore.setPile(newGameState.pile[0]);
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
