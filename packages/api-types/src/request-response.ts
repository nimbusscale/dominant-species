import { Game, GameCollection } from './game';
import { Player, PlayerCollection } from './player';
import { GameState } from './game-state';

export type ApiResponseType = Game | GameCollection | GameState | Player | PlayerCollection;
