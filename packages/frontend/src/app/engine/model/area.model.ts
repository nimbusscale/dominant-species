import { Space } from './space.model';
import { GameElement } from './game-element.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AreaState, SpaceState } from 'api-types/src/game-state';

export class Area extends GameElement<AreaState> {
  readonly spaces: Space[];
  private spacesSubject: BehaviorSubject<Space[]>;
  spaces$: Observable<Space[]>;
  private readonly spaceState: SpaceState[];

  constructor(id: string, spaces: Space[]) {
    const spaceState = spaces.map((space) => space.state);
    super({ id: id, space: spaceState });
    this.spaces = spaces;
    this.spacesSubject = new BehaviorSubject<Space[]>(this.spaces);
    this.spaces$ = this.spacesSubject.asObservable();
    this.spaceState = spaceState;
    this.initialize();
  }

  private initialize() {
    this.spaces.forEach((space, index) => {
      space.state$.subscribe((spaceState) => {
        this.spaceState[index] = spaceState;
        this.stateSubject.next(this.state);
        this.spacesSubject.next(this.spaces);
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
      this.spaces[index].setState(spaceState);
    });

    this.spacesSubject.next(this.spaces);
  }

  nextAvailableSpace(kind?: string): Space | null {
    const availableSpaces = this.spaces
      .filter((space) => !kind || space.kind === kind)
      .filter((space) => space.piece === null);

    return availableSpaces.length > 0 ? availableSpaces[0] : null;
  }
}
