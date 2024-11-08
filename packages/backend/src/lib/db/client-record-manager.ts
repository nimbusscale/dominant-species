import {DeleteItemCommand, Entity, FormattedItem, number, PutItemCommand, QueryCommand, schema, string} from "dynamodb-toolbox";
import {GameTable} from "./table";

export const ClientEntity = new Entity({
  table: GameTable,
  name: 'CLIENT',
  schema: schema({
    gameId: string().savedAs('id').key(),
    record: string().key(),
    clientId: string(),
    playerId: string()
  }),
});

export type ClientEntityType = FormattedItem<typeof ClientEntity>

export class ClientRecordManager {
  private readonly clientEntity: typeof ClientEntity
  private readonly gameTable: typeof GameTable

  constructor(clientEntity: typeof ClientEntity) {
    this.clientEntity = clientEntity
    this.gameTable = clientEntity.table
  }

  async addClient(gameId: string, clientId: string, playerId: string): Promise<undefined> {
    void (await this.clientEntity.build(PutItemCommand).item({
        gameId: gameId,
        record: `client:${clientId}`,
        clientId: clientId,
        playerId: playerId
      }).send()
    )
  }

  async removeClient(gameId: string, clientId: string): Promise<undefined> {
    void (await this.clientEntity.build(DeleteItemCommand).key({
      gameId: gameId,
      record: `client:${clientId}`
    }).send())
  }

  async getClients(gameId: string): Promise<string[]> {
    const result = await this.gameTable.build(QueryCommand).query({
      partition: gameId,
      range: { beginsWith: 'client:' },
    }).entities(ClientEntity).send()

    if (result.Items?.length) {
      return result.Items.map((clientRecord) => clientRecord.clientId);
    } else {
      return [];
    }
  }
}
