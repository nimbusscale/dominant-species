import {
  boolean,
  Entity,
  FormattedItem,
  list,
  number,
  PutItemCommand,
  QueryCommand,
  schema,
  string,
  UpdateItemCommand,
} from 'dynamodb-toolbox';
import { GameTable, GameTableIndex } from './table';
import { Game } from '../../../../api-types/src/game';

const GameEntity = new Entity({
  table: GameTable,
  name: 'GAME',
  schema: schema({
    username: string().savedAs('id').key(),
    record: string().key(),
    gameId: string(),
    host: string(),
    players: list(string()),
    startTS: number().default(() => Math.floor(Date.now() / 1000)),
    complete: boolean().default(false),
  }),
});

type GameEntityType = FormattedItem<typeof GameEntity>;

export async function addGameEntity(game: Game): Promise<void> {
  const putPromises = game.players.map((player) => {
    return GameEntity.build(PutItemCommand)
      .item({
        username: player,
        record: `game:${game.gameId}`,
        gameId: game.gameId,
        host: game.host,
        players: game.players,
      })
      .send();
  });
  void (await Promise.all(putPromises));
}

export async function getGameEntitiesForPlayer(
  username: string,
  includeCompleted = false,
): Promise<GameEntityType[]> {
  const result = await GameTable.build(QueryCommand)
    .query({
      index: GameTableIndex.BY_PLAYER_START,
      partition: username,
    })
    .entities(GameEntity)
    .options({
      limit: 10,
      reverse: true,
      ...(includeCompleted ? {} : { filters: { GAME: { attr: 'complete', eq: false } } }),
    })
    .send();

  if (result.Items) {
    return result.Items;
  } else {
    throw new Error(`Unexpected result: ${JSON.stringify(result)}`);
  }
}

export async function getGameEntitiesByGameId(gameId: string): Promise<GameEntityType[]> {
  const result = await GameTable.build(QueryCommand)
    .query({
      index: GameTableIndex.BY_GAME_ID,
      partition: gameId,
    })
    .entities(GameEntity)
    .send();

  if (result.Items?.length) {
    return result.Items;
  } else {
    throw new Error(`No GameEntities returned for game ${gameId}: ${JSON.stringify(result)}`);
  }
}

export async function completeGame(gameId: string): Promise<void> {
  const gameEntities = await getGameEntitiesByGameId(gameId);
  const updatePromises = gameEntities.map((gameEntity: GameEntityType) => {
    return GameEntity.build(UpdateItemCommand)
      .item({
        username: gameEntity.username,
        record: `game:${gameEntity.gameId}`,
        complete: true,
      })
      .send();
  });
  void (await Promise.all(updatePromises));
}
