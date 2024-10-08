import { GameStatePatch } from '../../../app/engine/model/game-state-patch.model';
import { GameState } from '../../../app/engine/model/game-state.model';
import {Pile, PileState} from "../../../app/engine/model/pile.model";
import {FactionState} from "../../../app/engine/model/faction.model";

function deepFreeze<T>(obj: T): T {
  const propNames = Object.getOwnPropertyNames(obj) as (keyof T)[];
  for (const name of propNames) {
    const value = obj[name];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}


export const testPileState1: PileState = deepFreeze({
      kind: 'pile1',
      inventory: { test1: 10, test2: 10 },
    })

export const testPileState2: PileState = deepFreeze(    {
      kind: 'pile2',
      inventory: { test3: 10 },
    })

export const testGameStatePatch1: GameStatePatch = deepFreeze({
  timeStamp: 1728051798261,
  patch: [
    { op: 'remove', path: '/pile/1' },
    { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
  ],
});

export const testGameState1: GameState = deepFreeze({
  pile: [
    {
      kind: 'pile1',
      inventory: { test1: 10, test2: 10 },
    },
    {
      kind: 'pile2',
      inventory: { test3: 10 },
    },
  ],
  faction: [
    {
      owner: {
        id: 'test1',
        name: 'Tester1',
      },
      kind: 'redTester',
    },
    {
      owner: {
        id: 'test2',
        name: 'Tester2',
      },
      kind: 'blueTester',
    },
  ],
} as { pile: PileState[]; faction: FactionState[] });

// Since testGameState1 is frozen, we need to just duplicate the object config here.
export const testGameState1updated: GameState = deepFreeze({
  pile: [
    {
      kind: 'pile1',
      // Updated with test1 = 20
      inventory: { test1: 20, test2: 10 },
    },
    // removed second pile
  ],
  faction: [
    {
      owner: {
        id: 'test1',
        name: 'Tester1',
      },
      kind: 'redTester',
    },
    {
      owner: {
        id: 'test2',
        name: 'Tester2',
      },
      kind: 'blueTester',
    },
  ],
} as { pile: PileState[]; faction: FactionState[] });
