import {defaultPieceFactory} from "../../../app/engine/model/piece.model";

describe('defaultPieceFactory', () => {
  it('should return a Piece object with the given kind, owner, and name when name is provided', () => {
    const result = defaultPieceFactory('pawn', 'player1', 'customName');
    expect(result).toEqual({ kind: 'pawn', owner: 'player1', name: 'customName' });
  });
  it('should return a Piece object with the given kind, owner, and startCase of kind as name when name is not provided', () => {
    const result = defaultPieceFactory('stronghold', 'player2');
    expect(result).toEqual({ kind: 'stronghold', owner: 'player2', name: 'Stronghold' });
  });
  it('should return a Piece object with the kind, null owner, and startCase of kind as name when owner is not provided', () => {
    const result = defaultPieceFactory('dragon');
    expect(result).toEqual({ kind: 'dragon', owner: null, name: 'Dragon' });
  });
  it('should handle empty string for name and return startCase of kind', () => {
    const result = defaultPieceFactory('queen', 'player1', '');
    expect(result).toEqual({ kind: 'queen', owner: 'player1', name: 'Queen' });
  });
});
