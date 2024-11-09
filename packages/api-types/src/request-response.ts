import {Game, GameCollection} from './game';
import {Player, PlayerCollection} from './player';
import {GameState} from './game-state';

export type ApiResponseType = Game | GameCollection | GameState | Player | PlayerCollection;

export interface QueryParameters {
  username?: string;
}

export interface ApiRequest {
  path: string;
  httpMethod: string;
  queryStringParameters: QueryParameters | null;
  username: string | null;
  body: string | null;
}

export interface ApiResponseHeaders {
  'Content-Type': string;
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
}

export interface ApiResponse {
  statusCode: number;
  body: string;
  headers?: ApiResponseHeaders;
}

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PATCH';
  pattern: RegExp;
  handler: (apiRequest: ApiRequest) => Promise<ApiResponseType | undefined>;
}
