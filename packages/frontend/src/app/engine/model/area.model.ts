import { Space } from './space.model';
import { GameElement } from './game-element.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AreaState, SpaceState } from 'api-types/src/game-state';

/**
 * An Area represents a collections of related Spaces.
 *
 * Each area has one or more Spaces. Each Space can contain a Piece. Each Space maintains its own state and the Area object keeps track
 * of the state of all the Spaces.
 */
export class Area extends GameElement<AreaState> {
  readonly spaces: Space[];
  private spacesSubject: BehaviorSubject<Space[]>;
  spaces$: Observable<Space[]>;
  private readonly spaceState: SpaceState[];

  constructor(state: AreaState) {
    super(state);
    this.spaces = state.space.map((spaceState) => new Space(spaceState));
    this.spacesSubject = new BehaviorSubject<Space[]>(this.spaces);
    this.spaces$ = this.spacesSubject.asObservable();
    this.spaceState = state.space;
    this.initialize();
  }

  private initialize() {
    this.spaces.forEach((space, index) => {
      space.space$.subscribe(() => {
        this.spacesSubject.next(this.spaces);
      });
      space.state$.subscribe(() => {
        this.spaceState[index] = space.state;
        this.stateSubject.next(this.state);
      });
    });
  }

  override setState(newState: AreaState) {
    if (newState.id != this.id) {
      throw new Error('State does not match area id');
    }

    if (this.spaces.length != newState.space.length) {
      throw new Error('Number of spaces in the new state does not match current state');
    }

    newState.space.forEach((spaceState, index) => {
      /* We need to set the state of the space in both the Area and the Space as the Space does not notify the Area when it's
         updated using setState. State updates are only sent when the local player takes an action. However, since setState is done
         when a GSP is received, there are no state update notifications sent, so anything interested in the state needs to be updated
         when the setState is done. So it needs to be done both at the Space and Area objects.
       */
      this.spaceState[index] = spaceState;
      this.spaces[index].setState(spaceState);
    });
  }

  nextAvailableSpace(kind?: string): Space | null {
    const availableSpaces = this.spaces
      .filter((space) => !kind || space.kind === kind)
      .filter((space) => space.piece === null);

    return availableSpaces.length > 0 ? availableSpaces[0] : null;
  }

  clearActions(): void {
    this.spaces.forEach((space) => {
      space.clearActions();
    });
  }
}
