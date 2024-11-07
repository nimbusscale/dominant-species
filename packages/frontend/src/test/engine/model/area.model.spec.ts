import { Area } from '../../../app/engine/model/area.model';
import { Space } from '../../../app/engine/model/space.model';
import { skip } from 'rxjs';
import { defaultPieceFactory } from '../../../app/engine/model/piece.model';
import { Piece } from 'api-types/src/game-state';

describe('Area', () => {
  let area: Area;
  let space1: Space;
  let space2: Space;
  let testPiece1: Piece;
  let testPiece2: Piece;

  beforeEach(() => {
    testPiece1 = defaultPieceFactory('testPiece', null);
    testPiece2 = defaultPieceFactory('testPiece', null);
    area = new Area({
      id: 'testArea',
      space: [
        { kind: 'testSpace', piece: null },
        { kind: 'testSpace', piece: null },
      ],
    });
    space1 = area.spaces[0];
    space2 = area.spaces[1];
  });
  describe('state', () => {
    it('state should include state of spaces', () => {
      space1.addPiece(testPiece1);
      expect(area.state).toEqual({
        id: 'testArea',
        space: [
          { kind: 'testSpace', piece: testPiece1 },
          { kind: 'testSpace', piece: null },
        ],
      });
    });
    it('setState should update space state', () => {
      const newState = {
        id: 'testArea',
        space: [
          { kind: 'testSpace', piece: testPiece1 },
          { kind: 'testSpace', piece: null },
        ],
      };
      area.setState(newState);
      expect(space1.piece).not.toBeNull();
    });
    it('state should be emitted when space updated', (done) => {
      area.state$.pipe(skip(1)).subscribe((state) => {
        expect(state.space[0].piece).not.toBeNull();
        done();
      });
      space1.addPiece(testPiece1);
    });
    it('should throw error if newState does not have same number of spaces', () => {
      const newState = {
        id: 'testArea',
        space: [{ kind: 'testSpace', piece: testPiece1 }],
      };
      expect(() => {
        area.setState(newState);
      }).toThrowError();
    });
  });
  describe('spaces$', () => {
    it('Spaces should be emitted when space updated', (done) => {
      area.spaces$.pipe(skip(1)).subscribe((spaces) => {
        expect(spaces[0].piece).toEqual(testPiece1);
        done();
      });
      space1.addPiece(testPiece1);
    });
    it('Spaces should be emitted when state updated', (done) => {
      area.spaces$.pipe(skip(1)).subscribe((spaces) => {
        expect(spaces[0].piece).toEqual(testPiece1);
        done();
      });
      const newState = {
        id: 'testArea',
        space: [
          { kind: 'testSpace', piece: testPiece1 },
          { kind: 'testSpace', piece: null },
        ],
      };
      area.setState(newState);
    });
  });
  describe('nextAvailableSpace', () => {
    it('returns next available space, when no kind is specified', () => {
      space1.addPiece(testPiece1);
      expect(area.nextAvailableSpace()).toBe(space2);
    });
    it('returns next available space, when kind is specified', () => {
      space1.addPiece(testPiece1);
      expect(area.nextAvailableSpace('testSpace')).toBe(space2);
    });
    it('returns null when no available spaces', () => {
      space1.addPiece(testPiece1);
      space2.addPiece(testPiece2);
      expect(area.nextAvailableSpace()).toBeNull();
    });
    it('returns null, when no space with matching kind is available', () => {
      space1.addPiece(testPiece1);
      expect(area.nextAvailableSpace('otherKind')).toBeNull();
    });
  });
});
