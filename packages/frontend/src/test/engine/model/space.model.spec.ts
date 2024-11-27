import {Space} from '../../../app/engine/model/space.model';
import {defaultPieceFactory} from '../../../app/engine/model/piece.model';
import {Piece} from 'api-types/src/game-state';
import {Action} from "../../../app/engine/model/action.model";
import {skip} from "rxjs";

describe('Space', () => {
  let testSpace: Space;
  let testPiece: Piece;
  let mockAction: jasmine.SpyObj<Action>

  beforeEach(() => {
    testSpace = new Space({kind: 'test', piece: null});
    testPiece = defaultPieceFactory('test');
    mockAction = jasmine.createSpyObj('Action', ['execute'])
  });
  describe('setState', () => {
    it('should allow set state if kinds match', () => {
      testSpace.setState({kind: 'test', piece: testPiece});
      expect(testSpace.state.piece).toEqual(testPiece);
    });
    it('should throw error if kinds dont match ', () => {
      expect(() => {
        testSpace.setState({kind: 'wrongType', piece: testPiece});
      }).toThrowError()
    });
  })
  describe('state$', () => {
    it('should not emit initial state', (done) => {
      const observerSpy = jasmine.createSpy('observerSpy');
      testSpace.state$.subscribe(observerSpy);
      setTimeout(() => {
        // Assert that the observerSpy was never called
        expect(observerSpy).not.toHaveBeenCalled();
        done();
      }, 100);
    });
    it('should allow to addPiece and emit state', (done) => {
      testSpace.state$.subscribe((state) => {
        expect(state.piece).toEqual(testPiece);
        done();
      });
      testSpace.addPiece(testPiece);
    });
    it('should allow to removePiece and emit state', (done) => {
      testSpace.addPiece(testPiece);
      testSpace.state$.subscribe((state) => {
        expect(state.piece).toBeNull();
        done();
      });
      expect(testSpace.removePiece()).toEqual(testPiece);
    });
    it('should not emit state when action added/cleared', (done) => {
      const observerSpy = jasmine.createSpy('observerSpy');
      testSpace.state$.subscribe(observerSpy);
      setTimeout(() => {
        // Assert that the observerSpy was never called
        expect(observerSpy).not.toHaveBeenCalled();
        done();
      }, 100);
      testSpace.setActions([mockAction])
      testSpace.clearActions()
    })
  })
  describe('space$', () => {
    it('emits self after instantiated', (done) => {
      testSpace.space$.subscribe((space) => {
        expect(space).toBe(testSpace)
        done()
      })
    })
    it('emits after Piece added', (done) => {
      testSpace.space$.pipe(skip(1)).subscribe((space) => {
        expect(space).toBe(testSpace)
        done()
      })
      testSpace.addPiece(testPiece)
    })
    it('emits after Piece removed', (done) => {
      testSpace.addPiece(testPiece)
      testSpace.space$.pipe(skip(1)).subscribe((space) => {
        expect(space).toBe(testSpace)
        done()
      })
      testSpace.removePiece()
    })
    it('emits after action added', (done) => {
      testSpace.space$.pipe(skip(1)).subscribe((space) => {
        expect(space).toBe(testSpace)
        done()
      })
      testSpace.setActions([mockAction])
    })
    it('emits after action removed', (done) => {
      testSpace.setActions([mockAction])
      testSpace.space$.pipe(skip(1)).subscribe((space) => {
        expect(space).toBe(testSpace)
        done()
      })
      testSpace.clearActions()
    })
  })
  describe('Invalid Add/Remove Piece', ()=> {
  it('should throw error if try to addPiece when already has a piece', () => {
    testSpace.addPiece(testPiece);
    expect(() => {
      testSpace.addPiece(testPiece);
    }).toThrowError();
  });
  it('should throw error when removePiece and no piece in space', () => {
    expect(() => {
      testSpace.removePiece();
    }).toThrowError();
  });
  })



});
