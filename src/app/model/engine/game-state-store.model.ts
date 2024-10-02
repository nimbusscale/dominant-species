import { PileState } from './pile.model';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

export interface GameState {
  pile: PileState<string>[];
}

export class GameStateStore {
  private gameState: GameState;
  private gameStateSubject: BehaviorSubject<GameState>;

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.gameStateSubject = new BehaviorSubject<GameState>(this.gameState);
  }

  // Will be replaced by function that will update state via GSP/
  setState(newState: GameState) {
    this.gameState = newState;
    this.gameStateSubject.next(this.gameState);
  }

  pileState$(): Observable<PileState<string>[]> {
    return this.gameStateSubject.asObservable().pipe(
      // Map to only the pile property from the GameState
      map((gameState) => gameState.pile),
      // Compare previous and current piles to emit only when piles change
      distinctUntilChanged(
        (previousPile, currentPile) => JSON.stringify(previousPile) === JSON.stringify(currentPile),
      ),
    );
  }
}
