import {Player} from "./player.model";

export interface FactionState {
  owner: Player;
  kind: string;
}
