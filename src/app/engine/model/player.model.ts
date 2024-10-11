import {GameElement} from "./game-element.model";

export interface PlayerState {
  id: string;
  name: string;
}


export class Player extends GameElement<PlayerState>{
  get name(): string {
    return this._state.name
  }
}
