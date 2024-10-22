import { Entity, PutItemCommand, schema, set, string } from 'dynamodb-toolbox';
import { GameTable } from './table';

const PlayerEntity = new Entity({
  table: GameTable,
  name: 'PLAYER',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key().default('player'),
    friends: set(string()).optional(),
  }),
});

export async function addPlayer(username: string): Promise<void> {
  void (await PlayerEntity.build(PutItemCommand)
    .item({
      username: username,
    })
    .send());
}
