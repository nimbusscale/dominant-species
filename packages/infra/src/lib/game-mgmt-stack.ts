import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_lambda,
  aws_lambda_nodejs,
  aws_iam,
  aws_dynamodb,
  aws_apigateway,
  aws_certificatemanager,
  aws_cognito,
  aws_s3,
  aws_apigatewayv2,
} from 'aws-cdk-lib';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { EnvVarNames } from '../../../backend/src/lib/enum';
import * as path from 'node:path';
import { WebSocketLambdaAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

export class GameMgmtStack extends cdk.Stack {
  readonly apiHandlerFunction: aws_lambda_nodejs.NodejsFunction;
  readonly authHandlerFunction: aws_lambda_nodejs.NodejsFunction;
  readonly wsHandlerFunction: aws_lambda_nodejs.NodejsFunction;
  readonly gameMgmtApiGw: aws_apigateway.LambdaRestApi;
  readonly gameStateApiGw: aws_apigatewayv2.WebSocketApi;
  readonly gameStateApiGwStage: aws_apigatewayv2.WebSocketStage

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps,
    gameMgmtRole: aws_iam.Role,
    gameTable: aws_dynamodb.TableV2,
    userPool: aws_cognito.UserPool,
    userPoolClient: aws_cognito.UserPoolClient,
    stateBucket: aws_s3.Bucket,
  ) {
    super(scope, id, props);

    this.apiHandlerFunction = new aws_lambda_nodejs.NodejsFunction(this, 'apiHandler', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/api-handler.ts'),
      handler: 'apiHandler',
      role: gameMgmtRole,
      environment: {
        [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
        [EnvVarNames.VPA_STATE_BUCKET_NAME]: stateBucket.bucketName,
      },
    });

    this.authHandlerFunction = new aws_lambda_nodejs.NodejsFunction(this, 'authHandler', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/auth-handler.ts'),
      handler: 'authHandler',
      role: gameMgmtRole,
      environment: {
        [EnvVarNames.COGNITO_CLIENT_ID]: userPoolClient.userPoolClientId,
        [EnvVarNames.COGNITO_USER_POOL_ID]: userPool.userPoolId,
      },
    });

    const gameMgmtApiGwAuthorizer = new aws_apigateway.CognitoUserPoolsAuthorizer(
      this,
      'vpaPlayers',
      {
        cognitoUserPools: [userPool],
      },
    );

    this.gameMgmtApiGw = new aws_apigateway.LambdaRestApi(this, 'gameMgmt', {
      handler: this.apiHandlerFunction,
      deployOptions: {
        stageName: 'v1',
      },
      domainName: {
        domainName: 'api.vpa-games.com',
        certificate: aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          'gameMgmtCert',
          'arn:aws:acm:us-east-2:011528296709:certificate/6d5e10a7-6cfd-49dc-b5f4-9dc0616b03c6',
        ),
      },
      defaultMethodOptions: {
        authorizationType: aws_apigateway.AuthorizationType.COGNITO,
        authorizer: gameMgmtApiGwAuthorizer,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
      },
    });

    const gameStateDomainName = new aws_apigatewayv2.DomainName(this, 'gameStateDomain', {
      domainName: 'state.vpa-games.com',
      certificate: aws_certificatemanager.Certificate.fromCertificateArn(
        this,
        'gameStateCert',
        'arn:aws:acm:us-east-2:011528296709:certificate/9cc1972f-d8d4-425b-86cc-d5d815616a47',
      ),
    });

    const gameStateAuthorizer = new WebSocketLambdaAuthorizer(
      'gameStateAuthorizer',
      this.authHandlerFunction,
    );

    this.gameStateApiGw = new aws_apigatewayv2.WebSocketApi(this, 'gameState');

    this.gameStateApiGwStage = new aws_apigatewayv2.WebSocketStage(this, 'v1', {
      webSocketApi: this.gameStateApiGw,
      stageName: 'v1',
      autoDeploy: true,
    });

    this.wsHandlerFunction = new aws_lambda_nodejs.NodejsFunction(this, 'wsHandler', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../../backend/src/ws-handler.ts'),
      handler: 'wsHandler',
      role: gameMgmtRole,
      environment: {
        [EnvVarNames.VPA_GAME_TABLE_NAME]: gameTable.tableName,
        [EnvVarNames.VPA_STATE_API_GW_URL]: this.gameStateApiGwStage.callbackUrl,
        [EnvVarNames.VPA_STATE_BUCKET_NAME]: stateBucket.bucketName,
      },
    });

    new aws_apigatewayv2.CfnApiMapping(this, 'gameStateDomainMapping', {
      apiId: this.gameStateApiGw.apiId,
      domainName: gameStateDomainName.name,
      stage: this.gameStateApiGwStage.stageName,
    });

    this.gameStateApiGw.addRoute('$connect', {
        authorizer: gameStateAuthorizer,
        integration: new WebSocketLambdaIntegration('ConnectIntegration', this.wsHandlerFunction),
      })

    this.gameStateApiGw.addRoute('$disconnect', {
        integration: new WebSocketLambdaIntegration(
          'DisconnectIntegration',
          this.wsHandlerFunction,
        ),
      })

        this.gameStateApiGw.addRoute('$default', {
        integration: new WebSocketLambdaIntegration(
          'DefaultIntegration',
          this.wsHandlerFunction,
        ),
      })
  }
}
