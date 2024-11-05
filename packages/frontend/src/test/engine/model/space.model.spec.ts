import { Space } from '../../../app/engine/model/space.model';
import { defaultPieceFactory } from '../../../app/engine/model/piece.model';
import { Piece } from 'api-types/src/game-state';

describe('Space', () => {
  let space: Space;
  let testPiece: Piece;

  beforeEach(() => {
    space = new Space({kind: 'test', piece: null});
    testPiece = defaultPieceFactory('test');
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
    space.setState({ kind: 'test', piece: testPiece });
    expect(space.state.piece).toEqual(testPiece);
  });
  it('should allow to addPiece and emit state', (done) => {
    space.state$.subscribe((state) => {
      expect(state.piece).not.toBeNull();
      done();
    });
    space.addPiece(testPiece);
  });
  it('should throw error if try to addPiece when already has a piece', () => {
    space.addPiece(testPiece);
    expect(() => {
      space.addPiece(testPiece);
    }).toThrowError();
  });
  it('should allow to removePiece and emit state', (done) => {
    space.addPiece(testPiece);
    space.state$.subscribe((state) => {
      expect(state.piece).toBeNull();
      done();
    });
    expect(space.removePiece()).toEqual(testPiece);
  });
  it('should throw error when removePiece and no piece in space', () => {
    expect(() => {
      space.removePiece();
    }).toThrowError();
  });
});
