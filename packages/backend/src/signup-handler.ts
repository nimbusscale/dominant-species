import { Callback, Context, Handler, PreSignUpTriggerEvent } from 'aws-lambda';

import { PlayerEntity, PlayerRecordManager } from './lib/db/player';

const playerRecordManager = new PlayerRecordManager(PlayerEntity);

export const signupHandler: Handler = async (
  event: PreSignUpTriggerEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    await playerRecordManager.addPlayer(event.userName);
    callback(null, event);
  } catch (e) {
    console.error(`failed on event ${JSON.stringify(event)}`);
    throw e;
  }
};
