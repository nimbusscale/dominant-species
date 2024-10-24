import { Game } from '../../../api-types/src/game'
import {addGame} from "../lib/db/game";

describe('placeholder', () => {
  it('log', () => {
    console.log('test');
  });
});

describe('game', () => {
  it('adds game records', async() => {
    const game: Game = {
      gameId: 'testGame123',
      host: 'tester1',
      players: ['tester1', 'tester2', 'tester3']
    }

    await addGame(game)
  })
})
