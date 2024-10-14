import {defaultPieceFactory} from "../../../app/engine/model/piece.model";

describe('defaultPieceFactory', () => {
  it('should return a Piece object with kind and owner and startCase of kind as name', () => {
    const result = defaultPieceFactory('pawn', 'player1');
    expect(result).toEqual({ kind: 'pawn', owner: 'player1', name: 'Pawn' });
  });

  it('should return a Piece object with kind and null owner, and startCase of kind as name when owner is not provided', () => {
    const result = defaultPieceFactory('knight');
    expect(result).toEqual({ kind: 'knight', owner: null, name: 'Knight' });
  });

  it('should handle camelCase in kind and convert it to startCase format for the name', () => {
    const result = defaultPieceFactory('castleDefense', 'player2');
    expect(result).toEqual({ kind: 'castleDefense', owner: 'player2', name: 'Castle Defense' });
  });

  it('should return a Piece object with kind, null owner, and the startCase of kind as name', () => {
    const result = defaultPieceFactory('dragonKing');
    expect(result).toEqual({ kind: 'dragonKing', owner: null, name: 'Dragon King' });
  });
});
