import { GameElement, GameElementState } from './game-element.model';

export interface PlayerState extends GameElementState {
  name: string;
}

export class Player extends GameElement<PlayerState> {
  get name(): string {
    return this._state.name;
  }
}

export interface PlayerAuthData {
  username: string;
  accessToken: string;
  accessTokenExpire: number;
  refreshToken: string;
}
