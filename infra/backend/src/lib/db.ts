import { Table } from 'dynamodb-toolbox/table'
import { Entity } from 'dynamodb-toolbox/entity'
import { schema } from 'dynamodb-toolbox/schema'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import {EnvVarNames} from "./enum";
import {PutItemCommand, set, string} from "dynamodb-toolbox";

const dynamoDBClient = new DynamoDBClient()
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient)


const GameTable = new Table({
  name: process.env[EnvVarNames.VPA_GAME_TABLE_NAME],
  partitionKey: {
    name: 'id',
    type: 'string'
  },
  sortKey: {
    name: 'record',
    type: 'string'
  },
  indexes: {
    gameByPlayerStart: {
      type: 'local',
      sortKey: { name: 'startTS', type: 'number' }
    }
  }

})
GameTable.documentClient = documentClient

const PlayerEntity = new Entity({
  table: GameTable,
  name: 'PLAYER',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key().default('player'),
    friends: set(string()).optional()
  })
})

export async function addPlayer(username: string): Promise<void> {
  void await PlayerEntity.build(PutItemCommand).item(
    {
      username: username,
    }
  ).send()
}
