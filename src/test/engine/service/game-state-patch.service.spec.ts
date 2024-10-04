import { GameStatePatchService } from '../../../app/engine/service/game-state-patch.service';
import { GameState } from '../../../app/engine/model/game-state.model';
import { Operation } from 'fast-json-patch';
import { GameStatePatch } from '../../../app/engine/model/game-state-patch.model';
import {testGameStatePatch1} from "./game-state-test.constant";

describe('GameStatePatchService', () => {
  let oldGameState: GameState;
  let newGameState: GameState;
  let service: GameStatePatchService;
  const patchOps: Operation[] = [
    { op: 'remove', path: '/pile/1' },
    { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
  ];

  beforeEach(() => {
    service = new GameStatePatchService();
    oldGameState = {
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
      ],
    };
    newGameState = JSON.parse(JSON.stringify(oldGameState)) as GameState;
    newGameState.pile[0].inventory['test1'] = 20;
    newGameState.pile.splice(1, 1);
  });

  describe('create', () => {
    it('creates a GSP', () => {
      const gsp = service.create(oldGameState, newGameState);
      expect(gsp.patch).toEqual(patchOps);
    });
  });

  describe('apply', () => {
    it('applies a GSP', () => {
      const updatedState = service.apply(oldGameState, testGameStatePatch1);
      expect(updatedState).toEqual(newGameState);
    });
  });
});
