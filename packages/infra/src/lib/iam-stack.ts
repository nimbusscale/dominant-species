import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_iam } from 'aws-cdk-lib';

export class IamStack extends cdk.Stack {
  readonly gameMgmtRole: aws_iam.Role;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.gameMgmtRole = new aws_iam.Role(this, 'GameMgmtRole', {
      assumedBy: new aws_iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    this.gameMgmtRole.addManagedPolicy(
      aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    );
    this.gameMgmtRole.addToPolicy(
      new aws_iam.PolicyStatement({
        actions: ['execute-api:ManageConnections'],
        resources: [
          `arn:aws:execute-api:${props.env?.region}:${props.env?.account}:*/*/POST/@connections/*`,
        ],
        effect: aws_iam.Effect.ALLOW,
      }),
    );
  }
}
