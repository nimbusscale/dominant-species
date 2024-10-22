import {Context, Handler, PreSignUpTriggerEvent} from 'aws-lambda';

export const handler: Handler = async (event: PreSignUpTriggerEvent, context: Context) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  return context.logStreamName;
};
