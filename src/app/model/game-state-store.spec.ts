import { GameState, GameStateStore } from './game-state-store.model';
import {skip} from "rxjs";

describe('GameStateStore', () => {
  let testGameState: GameState;
  let gameStateStore: GameStateStore

  beforeEach(() => {
    testGameState = {
      pile: [{ test1: 10, test2: 10 }, {test3: 10}],
    };
    gameStateStore = new GameStateStore(testGameState)
  });

  describe('pile', () => {
    describe('pileState$', () => {
      it('should have initial state', (done) => {
        gameStateStore.pileState$().subscribe((newPileState) => {
          expect(newPileState).toBe(testGameState.pile)
          done()
        })
      })
      it('should emit updated state when pile is updated', (done) => {
        const newGameState = {
          pile: [{ test1: 10, test2: 10 }, {test3: 20}],
        };
        gameStateStore.pileState$()
          .pipe(skip(1)) // Skip the initial state
          .subscribe((emittedPileState) => {
            expect(emittedPileState).toBe(newGameState.pile);
            done();
          });

        gameStateStore.setState(newGameState)
      });
    })
  })
});
