import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {aws_lambda, aws_lambda_nodejs, aws_iam} from "aws-cdk-lib";
import * as path from "node:path";

export class GameMgmt extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const gameMgmtRole = new aws_iam.Role(this, 'GameMgmtRole', {
      assumedBy: new aws_iam.ServicePrincipal('lambda.amazonaws.com')
    })
    gameMgmtRole.addManagedPolicy(aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'))

    const addUserToTableFromSignUpFunction = new aws_lambda_nodejs.NodejsFunction(this, 'addUserToTableFromSignUp', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../backend/src/index.ts'),
      handler: 'logEvent',
      role: gameMgmtRole
    })
  }
}
