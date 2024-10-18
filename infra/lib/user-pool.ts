import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {aws_cognito as cognito, Duration} from 'aws-cdk-lib'


export class UserPool extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  pool = new cognito.UserPool(this, 'vpaUserPool', {
    accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    autoVerify: {email: true},
    email: cognito.UserPoolEmail.withCognito(),
    enableSmsRole: false,
    keepOriginal: {email: true},
    mfa: cognito.Mfa.OFF,
    passwordPolicy: {
      minLength: 6,
      requireLowercase: false,
      requireUppercase: false,
      requireDigits: false,
      requireSymbols: false,
      tempPasswordValidity: Duration.days(3),
    },
    standardAttributes: {
      email: {
        required: true,
        mutable: false,
      }
    },
    selfSignUpEnabled: true,
    signInCaseSensitive: false,
    userPoolName: 'vpaPlayers',
  })

  client = this.pool.addClient('vpaWebClient', {
    authFlows: {userPassword: true},
    userPoolClientName: 'vpaWebClient',
  })

}


