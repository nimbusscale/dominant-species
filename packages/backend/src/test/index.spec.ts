import {Game} from '../../../api-types/src/game'
import {addGameEntity, completeGame, getGameEntitiesByGameId, getGameEntitiesForPlayer} from "../lib/db/game";

describe('placeholder', () => {
  it('log', () => {
    console.log('test');
  });
});

// describe('game', () => {
//   it('adds game records', async () => {
//     const game: Game = {
//       gameId: 'testGame2',
//       host: 'tester1',
//       players: ['tester1', 'tester2', 'tester3']
//     }
//
//     await addGameEntity(game)
//   })
//   it('gets game records', async () => {
//     console.log(await getGameEntitiesForPlayer('tester2'))
//   })
//   it('gets game record by id', async () => {
//     console.log(await getGameEntitiesByGameId('testGame1'))
//   })
//   it('completes a game', async () => {
//     console.log(await completeGame('testGame1'))
//   })
// })
