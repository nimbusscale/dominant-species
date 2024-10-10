import { Space } from '../../../app/engine/model/space.model';

describe('Space', () => {
  let space: Space;

  beforeEach(() => {
    space = new Space('test');
  });
  it('should not emit initial state', (done) => {
    const observerSpy = jasmine.createSpy('observerSpy');
    space.state$.subscribe(observerSpy);
    setTimeout(() => {
      // Assert that the observerSpy was never called
      expect(observerSpy).not.toHaveBeenCalled();
      done();
    }, 100);
  });
  it('should allow set state if kinds match', () => {
    space.setState({ kind: 'test', piece: { kind: 'test' } });
    expect(space.state.piece).toEqual({ kind: 'test' });
  });
  it('should allow to addPiece and emit state', (done) => {
    space.state$.subscribe((state) => {
      expect(state.piece).not.toBeNull();
      done();
    });
    space.addPiece({ kind: 'test' });
  });
  it('should throw error if try to addPiece when already has a piece', () => {
    space.addPiece({ kind: 'test' });
    expect(() => {
      space.addPiece({ kind: 'test' });
    }).toThrowError();
  });
  it('should allow to removePiece and emit state', (done) => {
    space.addPiece({ kind: 'test' });
    space.state$.subscribe((state) => {
      expect(state.piece).toBeNull();
      done();
    });
    space.removePiece();
  });
  it('should throw error when removePiece and no piece in space', () => {
    expect(() => {
      space.removePiece();
    }).toThrowError();
  });
});
