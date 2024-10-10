import { GameStatePatch } from '../../../app/engine/model/game-state-patch.model';
import { GameState, GlobalState } from '../../../app/engine/model/game-state.model';
import { PileState } from '../../../app/engine/model/pile.model';
import { FactionState } from '../../../app/engine/model/faction.model';
import { AreaState } from '../../../app/engine/model/area.model';

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
  id: 'pile1',
  inventory: { test1: 10, test2: 10 },
});

export const testPileState2: PileState = deepFreeze({
  id: 'pile2',
  inventory: { test3: 10 },
});

export const testGameStatePatch1: GameStatePatch = deepFreeze({
  timeStamp: 1728051798261,
  patch: [
    { op: 'remove', path: '/pile/1' },
    { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
  ],
});

export const testFactionState1: FactionState = deepFreeze({
  id: 'redTester',
  ownerId: 'tester1',
  score: 0,
});

export const testFactionState2: FactionState = deepFreeze({
  id: 'blueTester',
  ownerId: 'tester2',
  score: 0,
});

export const testGameState1: GameState = deepFreeze({
  area: [],
  faction: [testFactionState1, testFactionState2],
  global: {
    player: [],
  },
  pile: [
    {
      id: 'pile1',
      inventory: { test1: 10, test2: 10 },
    },
    {
      id: 'pile2',
      inventory: { test3: 10 },
    },
  ],
} as { area: AreaState[]; faction: FactionState[]; global: GlobalState; pile: PileState[] });

// Since testGameState1 is frozen, we need to just duplicate the object config here.
export const testGameState1updated: GameState = deepFreeze({
  area: [],
  faction: [testFactionState1, testFactionState2],
  global: {
    player: [],
  },
  pile: [
    {
      id: 'pile1',
      // Updated with test1 = 20
      inventory: { test1: 20, test2: 10 },
    },
    // removed second pile
  ],
} as { area: AreaState[]; faction: FactionState[]; global: GlobalState; pile: PileState[] });
