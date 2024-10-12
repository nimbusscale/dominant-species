import { Area } from '../../../app/engine/model/area.model';
import { Space } from '../../../app/engine/model/space.model';
import { skip } from 'rxjs';

describe('Area', () => {
  let area: Area;
  let space1: Space;
  let space2: Space;

  beforeEach(() => {
    // these should be mocks
    space1 = new Space('testSpace');
    space2 = new Space('testSpace');
    area = new Area('testArea', [space1, space2]);
  });
  it('state should include state of spaces', () => {
    space1.addPiece({ kind: 'testPiece' });
    expect(area.state).toEqual({
      id: 'testArea',
      space: [
        { kind: 'testSpace', piece: { kind: 'testPiece' } },
        { kind: 'testSpace', piece: null },
      ],
    });
  });
  it('setState should update space state', () => {
    const newState = {
      id: 'testArea',
      space: [
        { kind: 'testSpace', piece: { kind: 'testPiece' } },
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
    space1.addPiece({ kind: 'testPiece' });
  });
  it('should throw error if newState does not have same number of spaces', () => {
    const newState = {
      id: 'testArea',
      space: [{ kind: 'testSpace', piece: { kind: 'testPiece' } }],
    };
    expect(() => {
      area.setState(newState);
    }).toThrowError();
  });
  describe('nextAvailableSpace', () => {
    it('returns next available space', () => {
      space1.addPiece({ kind: 'testPiece' });
      expect(area.nextAvailableSpace()).toBe(space2)
    })
    it('returns null when no available spaces', () => {
      space1.addPiece({ kind: 'testPiece' });
      space2.addPiece({ kind: 'testPiece' });
      expect(area.nextAvailableSpace()).toBeNull()
    })


  })
});
