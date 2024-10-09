import { Space, SpaceState } from './space.model';
import { GameStateElement } from './game-state.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { deepClone } from 'fast-json-patch';

/**
 * AreaState does not extend GameStateElement as each Area is unique with a unique ID
 */
export interface AreaState extends GameStateElement {
  space: SpaceState[];
}

export class Area {
  readonly id: string;
  readonly spaces: Space[];
  private readonly spaceState: SpaceState[];
  private stateSubject: BehaviorSubject<AreaState>;
  state$: Observable<AreaState>;

  constructor(id: string, spaces: Space[]) {
    this.id = id;
    this.spaces = spaces;
    this.spaceState = spaces.map((space) => space.state);
    this.stateSubject = new BehaviorSubject<AreaState>(this.state);
    this.state$ = this.stateSubject.asObservable();
    this.initialize();
  }

  private initialize() {
    this.spaces.forEach((space, index) => {
      space.state$.subscribe((spaceState) => {
        this.spaceState[index] = spaceState;
        this.stateSubject.next(this.state);
      });
    });
  }

  get state(): AreaState {
    return deepClone({ id: this.id, space: this.spaceState }) as AreaState;
  }

  setState(newState: AreaState) {
    if (newState.id != this.id) {
      throw new Error('State does not match area id');
    }

    const currentSpaceKinds = this.spaces.map((space) => space.kind);
    const stateSpaceKinds = newState.space.map((space) => space.kind);
    if (currentSpaceKinds != stateSpaceKinds) {
      throw new Error('State does not match spaces in area');
    }

    newState.space.forEach((spaceState, index) => {
      this.spaces[index].setState(spaceState);
    });
  }
}
