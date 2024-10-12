import { Space, SpaceState } from './space.model';
import { GameElement, GameElementState } from './game-element.model';
import { isNull } from '../predicate';

/**
 * AreaState does not extend GameStateElement as each Area is unique with a unique ID
 */
export interface AreaState extends GameElementState {
  space: SpaceState[];
}

export class Area extends GameElement<AreaState> {
  readonly spaces: Space[];
  private readonly spaceState: SpaceState[];

  constructor(id: string, spaces: Space[]) {
    const spaceState = spaces.map((space) => space.state);
    super({ id: id, space: spaceState });
    this.spaces = spaces;
    this.spaceState = spaceState;
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
  }

  nextAvailableSpace(): Space | null {
    const availableSpaces = this.spaces.filter((space) => isNull(space.piece));
    if (availableSpaces.length > 0) {
      return availableSpaces[0];
    } else {
      return null;
    }
  }
}
