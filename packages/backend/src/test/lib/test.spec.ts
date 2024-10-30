import { expect, jest, it, describe, beforeEach } from '@jest/globals';
import {PlayerEntity, PlayerRecordManager} from "../../lib/db/player-record-manager";
import {GameStateEntity, GameStateRecordManager} from "../../lib/db/game-state-record-manager";
import {testGameState1} from "frontend/src/test/game-state-test.constant";


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


describe('GameStateRecordManager', () => {
  let gameStateRecordManager: GameStateRecordManager;

  beforeEach(() => {
    gameStateRecordManager = new GameStateRecordManager(GameStateEntity)
  })

  it('addInitialGameState', async () => {
    await gameStateRecordManager.addInitialGameState({
      gameId: 'test1233',
      host: 'tester1',
      players: ['tester1', 'tester2', 'tester3']
    })
  })

  it('gets latest state', async () => {
    console.log(await gameStateRecordManager.getLatestGameStateRecord('test123'))
  })
})
