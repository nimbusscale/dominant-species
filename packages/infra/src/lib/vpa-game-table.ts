import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb } from 'aws-cdk-lib';

export class VpaGamesTableStack extends cdk.Stack {
  readonly table: aws_dynamodb.TableV2;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
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
      ],
      timeToLiveAttribute: 'ttl',
    });
  }
}
