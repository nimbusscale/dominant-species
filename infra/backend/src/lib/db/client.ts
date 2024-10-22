import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoDBClient = new DynamoDBClient();
export const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);
