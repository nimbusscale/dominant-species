import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_lambda,
  aws_lambda_nodejs,
  aws_iam,
  aws_dynamodb,
  aws_apigateway,
  aws_certificatemanager, aws_cognito,
} from 'aws-cdk-lib';
import { EnvVarNames } from '../../../backend/src/lib/enum';
import * as path from 'node:path';

export class GameMgmtStack extends cdk.Stack {
  readonly apiHandlerFunction: aws_lambda_nodejs.NodejsFunction;
  readonly gameMgmtApiGw: aws_apigateway.LambdaRestApi;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps,
    gameMgmtRole: aws_iam.Role,
    gameTable: aws_dynamodb.TableV2,
    userPool: aws_cognito.UserPool
  ) {
    super(scope, id, props);

    this.apiHandlerFunction = new aws_lambda_nodejs.NodejsFunction(this, 'apiHandler', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/api-handler.ts'),
      handler: 'apiHandler',
      role: gameMgmtRole,
      environment: {
        [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
      },
    });

    const gameMgmtApiGwAuthorizer = new aws_apigateway.CognitoUserPoolsAuthorizer(this, 'vpaPlayers', {
        cognitoUserPools: [userPool]
    })

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
      defaultMethodOptions : {
        authorizationType: aws_apigateway.AuthorizationType.COGNITO,
        authorizer: gameMgmtApiGwAuthorizer
      }
    });


  }
}