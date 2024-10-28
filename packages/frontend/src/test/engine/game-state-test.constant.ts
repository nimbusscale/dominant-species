import { GameStatePatch } from '../../app/engine/model/game-state-patch.model';
import { GameState } from '../../app/engine/model/game-state.model';
import { PileState } from '../../app/engine/model/pile.model';
import { FactionState } from '../../app/engine/model/faction.model';
import { AreaState } from '../../app/engine/model/area.model';
import {Player} from "api-types/src/player";

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
  owner: 'test',
  inventory: { test1: 10, test2: 10 },
});

export const testPileState2: PileState = deepFreeze({
  id: 'pile2',
  owner: 'test',
  inventory: { test3: 10 },
});

export const testGameStatePatch1: GameStatePatch = deepFreeze({
  timeStamp: 1728051798261,
  patch: [
    { op: 'remove', path: '/pile/1' },
    { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
  ],
});

export const testPlayer1: Player = deepFreeze({
  username: 'tester1',
  friends: []
});

export const testPlayer2: Player = deepFreeze({
  username: 'tester2',
  friends: ['tester1']
});

export const testFactionState1: FactionState = deepFreeze({
  id: 'redTester',
  name: 'Red',
  ownerId: 'tester1',
  score: 0,
});

export const testFactionState2: FactionState = deepFreeze({
  id: 'blueTester',
  name: 'Blue',
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
      owner: 'test',
      inventory: { test1: 10, test2: 10 },
    },
    {
      id: 'pile2',
      owner: 'test',
      inventory: { test3: 10 },
    },
  ],
} as { area: AreaState[]; faction: FactionState[]; pile: PileState[] });

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
      owner: 'test',
      // Updated with test1 = 20
      inventory: { test1: 20, test2: 10 },
    },
    // removed second pile
  ],
} as { area: AreaState[]; faction: FactionState[]; pile: PileState[] });
