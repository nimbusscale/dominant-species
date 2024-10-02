import { GameState, GameStateStore } from './game-state-store.model';
import { skip } from 'rxjs';

describe('GameStateStore', () => {
  let testGameState: GameState;
  let gameStateStore: GameStateStore;

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
    gameStateStore = new GameStateStore(testGameState);
  });

  describe('pile', () => {
    describe('pileState$', () => {
      it('should have initial state', (done) => {
        gameStateStore.pileState$().subscribe((newPileState) => {
          expect(newPileState).toBe(testGameState.pile);
          done();
        });
      });
      it('should emit updated state when pile is updated', (done) => {
        const newGameState = {
          ...testGameState,
          pile: [
            {
              kind: 'pile1',
              inventory: { test1: 10, test2: 10 },
            },
            {
              kind: 'pile2',
              inventory: { test3: 20 },
            },
          ],
        };
        gameStateStore
          .pileState$()
          .pipe(skip(1)) // Skip the initial state
          .subscribe((emittedPileState) => {
            expect(emittedPileState).toBe(newGameState.pile);
            done();
          });

        gameStateStore.setState(newGameState);
      });
    });
  });
});
