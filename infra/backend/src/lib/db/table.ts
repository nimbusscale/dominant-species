import { Table } from 'dynamodb-toolbox';
import { EnvVarNames } from '../enum';
import { dynamoDBDocumentClient } from './client';

export const GameTable = new Table({
  documentClient: dynamoDBDocumentClient,
  name: process.env[EnvVarNames.VPA_GAME_TABLE_NAME],
  partitionKey: {
    name: 'id',
    type: 'string',
  },
  sortKey: {
    name: 'record',
    type: 'string',
  },
  indexes: {
    gameByPlayerStart: {
      type: 'local',
      sortKey: { name: 'startTS', type: 'number' },
    },
  },
});
