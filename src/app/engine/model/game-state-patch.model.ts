import { Operation } from 'fast-json-patch';

export interface GameStatePatch {
  timeStamp: number;
  patch: Operation[];
}
