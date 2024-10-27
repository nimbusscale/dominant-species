import { expect, jest, it, describe, beforeEach } from '@jest/globals';
import {PlayerEntity, PlayerRecordManager} from "../../lib/db/player";


describe('db', () => {
  let playerRecordManager: PlayerRecordManager;

  beforeEach(() => {
    playerRecordManager = new PlayerRecordManager(PlayerEntity)
  })

  it('adds user', async () => {
    await playerRecordManager.addPlayer('humannumber1')
  })
  it('gets valid player', async () => {
    console.log(await playerRecordManager.getPlayer('humannumber1'))
  })
  it('gets invalid player', async () => {
    console.log(await playerRecordManager.getPlayer('humannumber1'))
  })
  it('adds friend', async () => {
    console.log(await playerRecordManager.addFriend('humannumber1', 'tester1'))
  })
  it('remove friend', async () => {
    console.log(await playerRecordManager.removeFriend('humannumber1', 'tester1'))
  })
  it('adds friends, invalid user', async () => {
    console.log(await playerRecordManager.addFriend('humannumber2', 'tester1'))
  })
  it('finds players', async() => {
    console.log(await playerRecordManager.findPlayers('humannumber1'))
  })
})
