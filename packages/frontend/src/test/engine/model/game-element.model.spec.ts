import { GameElement, GameElementState } from '../../../app/engine/model/game-element.model';

export interface TestState extends GameElementState {
  score: number;
}

describe('GameElement', () => {
  let testState: TestState;
  let gameElement: GameElement<TestState>;

  beforeEach(() => {
    testState = {
      id: 'test',
      score: 0,
    };
    gameElement = new GameElement<TestState>(testState);
  });
  it('should get id', () => {
    expect(gameElement.id).toEqual('test');
  });
  it('should get copy of state', () => {
    const state = gameElement.state;
    expect(state).toEqual(testState);
    expect(state).not.toBe(testState);
  });
  it('should allow setting new state when ids match', () => {
    const newState = {
      id: 'test',
      score: 1,
    };
    gameElement.setState(newState);
    expect(gameElement.state).toEqual(newState);
  });
  it("should throw error when new state id doesn't match", () => {
    const newState = {
      id: 'mismatch',
      score: 1,
    };
    expect(() => {
      gameElement.setState(newState);
    }).toThrowError();
  });
  it('should emit state', (done) => {
    gameElement.state$.subscribe((state) => {
      expect(state).toEqual(testState);
      done();
    });
  });
});
