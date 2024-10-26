import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_cognito,
  aws_dynamodb,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  Duration,
} from 'aws-cdk-lib';
import path from 'node:path';
import { EnvVarNames } from '../../../backend/src/lib/enum';

export class UserPoolStack extends cdk.Stack {
  readonly userPool: aws_cognito.UserPool;
  readonly vpaWebClient: aws_cognito.UserPoolClient;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps,
    gameMgmtRole: aws_iam.Role,
    gameTable: aws_dynamodb.TableV2,
  ) {
    super(scope, id, props);

    const addUserToTableFromSignUpFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'addUserToTableFromSignUp',
      {
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/signup-handler.ts'),
        handler: 'signupHandler',
        role: gameMgmtRole,
        environment: {
          [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
        },
      },
    );

    this.userPool = new aws_cognito.UserPool(this, 'vpaUserPool', {
      accountRecovery: aws_cognito.AccountRecovery.EMAIL_ONLY,
      autoVerify: { email: true },
      email: aws_cognito.UserPoolEmail.withCognito(),
      enableSmsRole: false,
      keepOriginal: { email: true },
      mfa: aws_cognito.Mfa.OFF,
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
        },
      },
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      userPoolName: 'vpaPlayers',
      userVerification: {
        emailSubject: 'VPA Games Sign Up Confirmation',
        emailBody: 'Your verification code is {####}<P>http://www.vpa-games.com/sign-up-confirm',
        emailStyle: aws_cognito.VerificationEmailStyle.CODE,
      },
    });

    this.userPool.addTrigger(
      aws_cognito.UserPoolOperation.PRE_SIGN_UP,
      addUserToTableFromSignUpFunction,
    );

    this.vpaWebClient = this.userPool.addClient('vpaWebClient', {
      authFlows: { userPassword: true },
      userPoolClientName: 'vpaWebClient',
      accessTokenValidity: Duration.hours(12),
      idTokenValidity: Duration.hours(12),
    });
  }
}
