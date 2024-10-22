import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {aws_lambda, aws_lambda_nodejs} from "aws-cdk-lib";
import * as path from "node:path";

export class GameMgmt extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  addUser = new aws_lambda_nodejs.NodejsFunction(this, 'vpaAddUserToTable', {
    runtime: aws_lambda.Runtime.NODEJS_20_X,
    entry: path.join(__dirname, '../backend/src/index.ts'),
    handler: 'logEvent'
  })

}
