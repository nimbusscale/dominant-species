import {Context, Handler, PreSignUpTriggerEvent} from 'aws-lambda';

export const addUserToTableFromSignUp: Handler = async (event: PreSignUpTriggerEvent, context: Context) => {
  console.log(JSON.stringify(event))
};
