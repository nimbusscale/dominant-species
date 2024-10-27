import {
  Entity,
  FormattedItem,
  GetItemCommand,
  PutItemCommand,
  schema,
  set,
  string,
  Table,
  UpdateItemCommand,
  $add,
  $delete, QueryCommand
} from 'dynamodb-toolbox';
import {GameTable, GameTableIndex} from './table';
import {Player} from "api-types/src/player";
import {result} from "lodash";

export const PlayerEntity = new Entity({
  table: GameTable,
  name: 'PLAYER',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key().default('player'),
    friends: set(string()).optional(),
  }),
});

type PlayerEntityType = FormattedItem<typeof PlayerEntity>;


export class PlayerRecordManager {
  private readonly playerEntity: Entity;
  private readonly gameTable: Table;

  constructor(playerEntity: Entity) {
    this.playerEntity = playerEntity;
    this.gameTable = playerEntity.table
  }

  private playerEntityToPlayer({username, friends}: PlayerEntityType): Player {
    return {
      username: username,
      friends: friends ? friends : new Set([])
    }
  }

  async addPlayer(username: string): Promise<undefined> {
    void (await PlayerEntity.build(PutItemCommand)
      .item({
        username: username
      })
      .send());
  }

  async getPlayer(username: string): Promise<Player | undefined> {
    const result = await this.playerEntity.build(GetItemCommand).key(
      {username: username, record: 'player'}
    ).send()
    if (result.Item) {
      return this.playerEntityToPlayer(result.Item as PlayerEntityType)
    } else {
      return undefined
    }
  }

  // throws ConditionalCheckFailedException if user not found
  async addFriend(username: string, friendUsername: string): Promise<undefined> {
    await this.playerEntity.build(UpdateItemCommand).item(
      {
        username: username,
        record: 'player',
        friends: $add(new Set([friendUsername])),
      }
    ).options(
      {
        condition: {attr: 'username', eq: username}
      }
    ).send()
  }

  async removeFriend(username: string, friendUsername: string): Promise<undefined> {
  await this.playerEntity.build(UpdateItemCommand).item(
      {
        username: username,
        record: 'player',
        friends: $delete(new Set([friendUsername])),
      }
    ).options(
      {
        condition: {attr: 'username', eq: username}
      }
    ).send()
  }

  async findPlayers(username: string): Promise<Player[]> {
    const result = await this.gameTable.build(QueryCommand).query(
      {
        partition: 'player',
        range: { beginsWith: username },
        index: GameTableIndex.BY_RECORD,
      }
    ).entities(PlayerEntity).send()
    if (result.Items) {
      return result.Items.map((playerEntity) => this.playerEntityToPlayer(playerEntity))
    } else {
      return []
    }
  }
}
