import {
  Entity,
  FormattedItem,
  GetItemCommand,
  PutItemCommand,
  schema,
  string,
  UpdateItemCommand,
  QueryCommand,
  list,
} from 'dynamodb-toolbox';
import { GameTable, GameTableIndex } from './table';
import { Player } from 'api-types/src/player';

export const PlayerEntity = new Entity({
  table: GameTable,
  name: 'PLAYER',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key().default('player'),
    friends: list(string()).default([]),
  }),
});

type PlayerEntityType = FormattedItem<typeof PlayerEntity>;

export class PlayerRecordManager {
  private readonly playerEntity: typeof PlayerEntity;
  private readonly gameTable: typeof GameTable;

  constructor(playerEntity: typeof PlayerEntity) {
    this.playerEntity = playerEntity;
    this.gameTable = playerEntity.table;
  }

  private playerEntityToPlayer({ username, friends }: PlayerEntityType): Player {
    return {
      username: username,
      friends: friends,
    };
  }

  async addPlayer(username: string): Promise<void> {
    void (await PlayerEntity.build(PutItemCommand)
      .item({
        username: username,
      })
      .send());
  }

  async getPlayer(username: string): Promise<Player | null> {
    const result = await this.playerEntity
      .build(GetItemCommand)
      .key({ username: username, record: 'player' })
      .send();
    if (result.Item) {
      return this.playerEntityToPlayer(result.Item as PlayerEntityType);
    } else {
      return null;
    }
  }

  // throws ConditionalCheckFailedException if user not found
  async setFriends(username: string, friends: string[]): Promise<void> {
    await this.playerEntity
      .build(UpdateItemCommand)
      .item({
        username: username,
        record: 'player',
        friends: friends,
      })
      .options({
        condition: { attr: 'username', eq: username },
      })
      .send();
  }

  async findPlayers(username: string): Promise<Player[]> {
    const result = await this.gameTable
      .build(QueryCommand)
      .query({
        partition: 'player',
        range: { beginsWith: username },
        index: GameTableIndex.BY_RECORD,
      })
      .entities(PlayerEntity)
      .send();
    if (result.Items) {
      return result.Items.map((playerEntity) => this.playerEntityToPlayer(playerEntity));
    } else {
      return [];
    }
  }
}
