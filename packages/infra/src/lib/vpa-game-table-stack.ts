import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb, aws_iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class VpaGamesTableStack extends cdk.Stack {
  readonly table: aws_dynamodb.TableV2;

  constructor(scope: Construct, id: string, props: cdk.StackProps, gameMgmtRole: aws_iam.Role) {
    super(scope, id, props);

    this.table = new aws_dynamodb.TableV2(this, 'vpaGameTable', {
      tableName: 'vpaGame',
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'record', type: aws_dynamodb.AttributeType.STRING },
      billing: aws_dynamodb.Billing.onDemand(),
      localSecondaryIndexes: [
        {
          indexName: 'gameByPlayerStart',
          sortKey: { name: 'startTS', type: aws_dynamodb.AttributeType.NUMBER },
        },
      ],
      globalSecondaryIndexes: [
        {
          indexName: 'gameByGameId',
          partitionKey: { name: 'gameId', type: aws_dynamodb.AttributeType.STRING },
        },
        {
          indexName: 'byRecord',
          partitionKey: { name: 'record', type: aws_dynamodb.AttributeType.STRING },
          sortKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
        },
      ],
      timeToLiveAttribute: 'ttl',
    });

    this.table.grantReadWriteData(gameMgmtRole);
  }
}
