import { GameElementStates, SpaceState } from 'api-types/src/game-state';
import { shuffle, startCase } from 'lodash';
import { AnimalEnum } from '../constant/animal.constant';
import { getOrThrow } from '../../engine/util/misc';
import { elementConfigByAnimal } from '../constant/element-config.constant';
import { baseGameElementStates } from '../constant/game-state.constant';
import { deepClone } from 'fast-json-patch';
import { Space } from '../../engine/model/space.model';
import { SpaceKindEnum } from '../constant/area.constant';
import { defaultPieceFactory } from '../../engine/model/piece.model';
import { pileIdsByAnimal } from '../constant/pile-config';
import { PieceKindEnum } from '../constant/piece.constant';
import { InitialGameElementStatesFactory } from '../../engine/model/game-state.model';

// Not injectable as it's built on-demand by GameStateInitializationService
export class GameElementStatesFactoryService implements InitialGameElementStatesFactory {
  build(playerIds: string[]): GameElementStates {
    const gameElementStates = deepClone(baseGameElementStates) as GameElementStates;
    return this.buildFactions(playerIds, gameElementStates);
  }

  private buildFactions(
    playerIds: string[],
    gameElementStates: GameElementStates,
  ): GameElementStates {
    const shuffledAnimals = shuffle(Object.values(AnimalEnum));
    playerIds.forEach((playerId: string, index) => {
      const assignedAnimal = shuffledAnimals[index];
      const elementConfig = getOrThrow(elementConfigByAnimal, assignedAnimal);

      gameElementStates.faction.push({
        id: assignedAnimal,
        name: startCase(assignedAnimal),
        ownerId: playerId,
        score: 0,
      });

      // AnimalCard Spaces
      const elementSpacesState: SpaceState[] = [];
      // inherent element spaces
      for (let i = 0; i < elementConfig.inherentCount; i++) {
        const space = new Space({kind: SpaceKindEnum.ELEMENT, piece: null});
        space.addPiece(defaultPieceFactory(elementConfig.kind));
        elementSpacesState.push(space.state);
      }

      // added element spaces
      for (let i = 0; i < 6 - elementConfig.inherentCount; i++) {
        const space = new Space({kind: SpaceKindEnum.ELEMENT, piece: null});
        elementSpacesState.push(space.state);
      }

      gameElementStates.area.push({
        id: elementConfig.areaId,
        space: elementSpacesState,
      });

      const actionPawnPileState = {
        id: getOrThrow(pileIdsByAnimal, assignedAnimal).actionPawn,
        owner: assignedAnimal,
        inventory: {
          [PieceKindEnum.ACTION_PAWN]: 9 - playerIds.length,
        },
      };
      gameElementStates.pile.push(actionPawnPileState);

      const speciesPileState = {
        id: getOrThrow(pileIdsByAnimal, assignedAnimal).species,
        owner: assignedAnimal,
        inventory: {
          [PieceKindEnum.SPECIES]: 65 - playerIds.length * 5,
        },
      };
      gameElementStates.pile.push(speciesPileState);
    });
    return gameElementStates;
  }
}
