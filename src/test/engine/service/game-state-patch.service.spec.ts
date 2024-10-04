import { GameStatePatchService } from '../../../app/engine/service/game-state-patch.service';
import { Operation } from 'fast-json-patch';
import {
  testGameState1,
  testGameState1updated,
  testGameStatePatch1,
} from './game-state-test.constant';

describe('GameStatePatchService', () => {
  let service: GameStatePatchService;
  const patchOps: Operation[] = [
    { op: 'remove', path: '/pile/1' },
    { op: 'replace', path: '/pile/0/inventory/test1', value: 20 },
  ];

  beforeEach(() => {
    service = new GameStatePatchService();
  });

  describe('create', () => {
    it('creates a GSP', () => {
      const gsp = service.create(testGameState1, testGameState1updated);
      expect(gsp.patch).toEqual(patchOps);
    });
  });

  describe('apply', () => {
    it('applies a GSP', () => {
      const updatedState = service.apply(testGameState1, testGameStatePatch1);
      expect(updatedState).toEqual(testGameState1updated);
    });
  });
});
