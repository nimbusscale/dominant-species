import { Table } from 'dynamodb-toolbox';
import { EnvVarNames } from '../enum';
import { dynamoDBDocumentClient } from './client';

export enum GameTableIndex {
  BY_GAME_ID = 'gameByGameId',
  BY_PLAYER_START = 'gameByPlayerStart',
  BY_RECORD = 'byRecord',
}

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
    gameByGameId: {
      type: 'global',
      partitionKey: { name: 'gameId', type: 'string' },
    },
    byRecord: {
      type: 'global',
      partitionKey: { name: 'record', type: 'string' },
      sortKey: { name: 'id', type: 'string' },
    },
  },
});
