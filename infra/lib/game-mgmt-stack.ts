import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {aws_lambda, aws_lambda_nodejs, aws_iam, aws_dynamodb} from "aws-cdk-lib";
import * as path from "node:path";

export class GameMgmtStack extends cdk.Stack {
  readonly gameMgmtRole: aws_iam.Role
  readonly addUserToTableFromSignUpFunction: aws_lambda_nodejs.NodejsFunction


  constructor(scope: Construct, id: string, props: cdk.StackProps, gameTable: aws_dynamodb.TableV2) {
    super(scope, id, props);
    this.gameMgmtRole = new aws_iam.Role(this, 'GameMgmtRole', {
      assumedBy: new aws_iam.ServicePrincipal('lambda.amazonaws.com')
    })
    this.gameMgmtRole.addManagedPolicy(aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'))
    gameTable.grantReadWriteData(this.gameMgmtRole)

    this.addUserToTableFromSignUpFunction = new aws_lambda_nodejs.NodejsFunction(this, 'addUserToTableFromSignUp', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../backend/src/index.ts'),
      handler: 'logEvent',
      role: this.gameMgmtRole
    })
  }
}
