import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_cognito, aws_lambda, Duration } from 'aws-cdk-lib';

export class UserPoolStack extends cdk.Stack {
  readonly userPool: aws_cognito.UserPool;
  readonly vpaWebClient: aws_cognito.UserPoolClient;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps,
    addUserFunction: aws_lambda.Function,
  ) {
    super(scope, id, props);

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
        emailBody: 'Your verification code is {####}<P>http://vpa-games.com/sign-up-confirm',
        emailStyle: aws_cognito.VerificationEmailStyle.CODE,
      },
    });

    this.userPool.addTrigger(aws_cognito.UserPoolOperation.PRE_SIGN_UP, addUserFunction);

    this.vpaWebClient = this.userPool.addClient('vpaWebClient', {
      authFlows: { userPassword: true },
      userPoolClientName: 'vpaWebClient',
      accessTokenValidity: Duration.hours(12),
    });
  }
}
