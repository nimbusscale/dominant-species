import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class VpaGamesTable extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  table = new dynamodb.TableV2(this, 'vpaGameTable', {
    tableName: 'vpaGame',
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING},
    sortKey: { name: 'record', type: dynamodb.AttributeType.STRING },
    billing: dynamodb.Billing.onDemand(),
    localSecondaryIndexes: [
      {
        indexName: 'gameByPlayerStart',
        sortKey: { name: 'startTS', type: dynamodb.AttributeType.NUMBER },
      }
    ],
    timeToLiveAttribute: 'ttl'
  })

}
