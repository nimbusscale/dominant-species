import { Callback, Context, Handler, PreSignUpTriggerEvent } from 'aws-lambda';

import { addPlayer } from './lib/db/player';

export const addUserToTableFromSignUp: Handler = async (
  event: PreSignUpTriggerEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    await addPlayer(event.userName);
    callback(null, event);
  } catch (e) {
    console.error(`failed on event ${JSON.stringify(event)}`);
    throw e;
  }
};

export const helloWorld: Handler = async (
  event: PreSignUpTriggerEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event);
  callback(null, { statusCode: 200, body: 'Hello World!' });
};
