import {DeleteItemCommand, Entity, FormattedItem, number, PutItemCommand, QueryCommand, schema, string} from "dynamodb-toolbox";
import {GameTable, GameTableIndex} from "./table";

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

  async removeClient(clientId: string): Promise<undefined> {
    const clientRecord = await this.getClient(clientId)
    if (clientRecord) {
      void (await this.clientEntity.build(DeleteItemCommand).key({
        gameId: clientRecord?.gameId,
        record: `client:${clientId}`
      }).send())
    } else {
      throw new Error(`Unable to remove client record for clientId: ${clientId}`)
    }
  }

  async getClient(clientId: string): Promise<ClientEntityType | null> {
    const result = await this.gameTable.build(QueryCommand).query({
      index: GameTableIndex.BY_RECORD,
      partition: `client:${clientId}`
    }).entities(ClientEntity).send()

    if (result.Items) {
      if (result.Items.length === 1) {
        return result.Items[0]
      } else if (result.Items?.length > 1) {
        throw new Error(`Returned more than one record for clientId: ${clientId}`)
      }
    }
    return null;
  }

  async getClientsForGame(gameId: string): Promise<string[]> {
    const result = await this.gameTable.build(QueryCommand).query({
      partition: gameId,
      range: {beginsWith: 'client:'},
    }).entities(ClientEntity).send()

    if (result.Items?.length) {
      return result.Items.map((clientRecord) => clientRecord.clientId);
    } else {
      return [];
    }
  }
}
