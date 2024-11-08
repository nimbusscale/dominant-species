import { expect, jest, it, describe, beforeEach } from '@jest/globals';
import { PlayerEntity, PlayerRecordManager } from '../../lib/db/player-record-manager';
import { GameStateEntity, GameStateRecordManager } from '../../lib/db/game-state-record-manager';
import { testGameState1 } from 'frontend/src/test/game-state-test.constant';
import {validateCognitoJwt} from "../../lib/auth";

// describe('db', () => {
//   let playerRecordManager: PlayerRecordManager;
//
//   beforeEach(() => {
//     playerRecordManager = new PlayerRecordManager(PlayerEntity)
//   })
//
//   it('adds user', async () => {
//     await playerRecordManager.addPlayer('humannumber1')
//   })
//   it('gets valid player', async () => {
//     console.log(await playerRecordManager.getPlayer('humannumber1'))
//   })
//   it('gets invalid player', async () => {
//     console.log(await playerRecordManager.getPlayer('humannumber1'))
//   })
//   it('finds players', async() => {
//     console.log(await playerRecordManager.findPlayers('humannumber1'))
//   })
//   it('set friends', async() => {
//     console.log(await playerRecordManager.setFriends('tester3', ['tester1', 'tester2']))
//   })
// })

// import {StateObjectManager} from "../../lib/state/state-object-manager";
// import {testGameState1} from "api-types/src/game-state-test.constant";
//
// describe('StateObjectManager', () => {
//   let stateObjectManager: StateObjectManager
//
//   beforeEach(() => {
//     stateObjectManager = new StateObjectManager()
//   })
//
//   it('uploads', async () => {
//     await stateObjectManager.putGameState(testGameState1)
//   })
//   it('downloads', async () => {
//     console.log(await stateObjectManager.getGameState('testGame1', 0))
//   })
// })

// describe('GameStateRecordManager', () => {
//   let gameStateRecordManager: GameStateRecordManager;
//
//   beforeEach(() => {
//     gameStateRecordManager = new GameStateRecordManager(GameStateEntity);
//   });
//
//   it('gets latest state', async () => {
//     console.log(await gameStateRecordManager.getLatestGameStateRecord('test1233'));
//   });
// });

describe('validateCognitoJwt', () => {
  it('passes valid', async () => {
    const jwt = 'eyJraWQiOiIxdU1KcXN4SzBoV1FMNGN4OFVWZ2hCUnQybzJ6alhpSmhOcEhLeGdhZ0VjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMWJiYTUzMC0yMDIxLTcwYmUtNDk1Yy1iYzk5NzAyZTBhY2QiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfTlM5Z3lyS3dnIiwiY29nbml0bzp1c2VybmFtZSI6Imh1bWFubnVtYmVyMSIsIm9yaWdpbl9qdGkiOiI0ZTFkYjg0Yy03MzVhLTRlYjAtOTJiMS1jMmNjYmQwNTljNDIiLCJhdWQiOiI1YnA0OHE3N3Y3azJzMHBla3JtbzJxdjVhYyIsImV2ZW50X2lkIjoiZmRkYWI4YjYtMDY4MC00MTFhLWE3ZTMtY2ZlNjMwZWNiNDJjIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzEwODQ2MTcsImV4cCI6MTczMTEyNzgxNywiaWF0IjoxNzMxMDg0NjE3LCJqdGkiOiIxZjc1MzhkNy02NDNhLTRhZTQtYWNjYi1lMTAxZTg1ZTM1NDgiLCJlbWFpbCI6ImpvZUBqamszLmNvbSJ9.sif7H9-mr0CD2PZqJYlhma5Pxc5rGnpyD3slGaFP1AUhmxtHlVAotNBpTOwfMrqULo_AjxTgxj75U12ILN9Cnmf8TwU0YmKwvLmyrQ9bxDqumO9uufBTlPWVo520cDqdk8Jgtio0CwESgoVIssTYBn4nCg0D5Nql12EntS10Vo0VTYI0KzkASc7ifyni8nZg46HebxGfCj1IRRCWMlPWSovQBRbMA90GC5k6cagxcAjFMzRA9DWo314zRD2wBapIbHHOi3FOqdX4SDKmsQSjEIeTrqzSVKvn8JdP-pMHo9u7p-HJevmPMGUaSOJYAt9uN6GPFWZyP3g6fJ50e2hebg'
    expect(await validateCognitoJwt(jwt)).toEqual(true)
  })
})
