import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_lambda,
  aws_lambda_nodejs,
  aws_iam,
  aws_dynamodb,
  aws_apigateway,
  aws_certificatemanager,
} from 'aws-cdk-lib';
import { EnvVarNames } from '../../../backend/src/lib/enum';
import * as path from 'node:path';

export class GameMgmtStack extends cdk.Stack {
  readonly gameMgmtRole: aws_iam.Role;
  readonly addUserToTableFromSignUpFunction: aws_lambda_nodejs.NodejsFunction;
  readonly helloWorldFunction: aws_lambda_nodejs.NodejsFunction;
  readonly apiHandlerFunction: aws_lambda_nodejs.NodejsFunction;
  readonly gameMgmtApiGw: aws_apigateway.LambdaRestApi;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps,
    gameTable: aws_dynamodb.TableV2,
  ) {
    super(scope, id, props);
    this.gameMgmtRole = new aws_iam.Role(this, 'GameMgmtRole', {
      assumedBy: new aws_iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    this.gameMgmtRole.addManagedPolicy(
      aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    );
    gameTable.grantReadWriteData(this.gameMgmtRole);

    this.addUserToTableFromSignUpFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'addUserToTableFromSignUp',
      {
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, '../../../backend/src/index.ts'),
        handler: 'addUserToTableFromSignUp',
        role: this.gameMgmtRole,
        environment: {
          [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
        },
      },
    );

    this.helloWorldFunction = new aws_lambda_nodejs.NodejsFunction(this, 'helloWorld', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/index.ts'),
      handler: 'helloWorld',
      role: this.gameMgmtRole,
      environment: {
        [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
      },
    });

    this.apiHandlerFunction = new aws_lambda_nodejs.NodejsFunction(this, 'apiHandler', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/api-handler.ts'),
      handler: 'apiHandler',
      role: this.gameMgmtRole,
      environment: {
        [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
      },
    });

    this.gameMgmtApiGw = new aws_apigateway.LambdaRestApi(this, 'gameMgmt', {
      handler: this.apiHandlerFunction,
      deployOptions: {
        stageName: 'v1',
      },
      domainName: {
        domainName: 'api.vpa-games.com',
        certificate: aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          'api.vpa-games.com',
          'arn:aws:acm:us-east-2:011528296709:certificate/6d5e10a7-6cfd-49dc-b5f4-9dc0616b03c6',
        ),
      },
    });
  }
}
