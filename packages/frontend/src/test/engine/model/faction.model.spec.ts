import { Faction } from '../../../app/engine/model/faction.model';
import { deepClone } from 'fast-json-patch';
import { FactionState } from 'api-types/src/game-state';
import { testFactionState1 } from '../../game-state-test.constant';

describe('Faction', () => {
  let faction: Faction;

  beforeEach(() => {
    faction = new Faction(deepClone(testFactionState1) as FactionState);
  });
  it('can get ownerId', () => {
    expect(faction.ownerId).toEqual('tester1');
  });
  it('can get score', () => {
    expect(faction.score).toEqual(0);
  });
  it('can increase score', () => {
    faction.increaseScore(1);
    expect(faction.score).toEqual(1);
  });
  it('can decrease score', () => {
    faction.decreaseScore(1);
    expect(faction.score).toEqual(-1);
  });
  it('can set score', () => {
    faction.increaseScore(10);
    expect(faction.score).toEqual(10);
  });
});
