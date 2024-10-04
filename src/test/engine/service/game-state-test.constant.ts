import { GameStatePatch } from '../../../app/engine/model/game-state-patch.model';

function deepFreeze<T>(obj: T): T {
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = (obj as any)[name];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

export const testGameStatePatch1: GameStatePatch = deepFreeze({
  timeStamp: 1728051798261,
  patch: [
    { op: 'remove', path: '/pile/1' },
    { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
  ],
});
