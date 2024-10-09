import {Space} from "./space.model";

/**
 * AreaState does not extend GameStateElement as each Area is unique with a unique ID
 */
export interface AreaState {
  id: string
  spaces: Space[]
}


export class Area {
  private _state: AreaState | null = null

  constructor(state: AreaState) {
    this._state = state
  }
}
