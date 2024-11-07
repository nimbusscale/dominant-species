import {GameElementStates, SpaceState} from 'api-types/src/game-state';
import {shuffle, startCase} from 'lodash';
import {AnimalEnum} from '../constant/animal.constant';
import {getOrThrow} from '../../engine/util/misc';
import {elementConfigByAnimal} from '../constant/element-config.constant';
import {deepClone} from 'fast-json-patch';
import {Space} from '../../engine/model/space.model';
import {AreaIdEnum, SpaceKindEnum} from '../constant/area.constant';
import {defaultPieceFactory} from '../../engine/model/piece.model';
import {pileIdsByAnimal} from '../constant/pile-config';
import {PieceKindEnum} from '../constant/piece.constant';
import {emptyGameElementStates, InitialGameElementStatesFactory} from '../../engine/model/game-state.model';
import {Area} from "../../engine/model/area.model";
import {Pile} from "../../engine/model/pile.model";
import {PileIdEnum} from "../constant/pile.constant";
import {ElementEnum} from "../constant/element.constant";


// Not injectable as it's built on-demand by GameStateInitializationService
export class GameElementStatesFactoryService implements InitialGameElementStatesFactory {
  private readonly gameElementStates: GameElementStates
  private elementDrawPool: Pile

  constructor() {
    this.gameElementStates = deepClone(emptyGameElementStates) as GameElementStates;
    this.elementDrawPool = this.buildElementDrawPool()
  }

  build(playerIds: string[]): GameElementStates {
    this.buildFactions(playerIds);
    this.buildActionDisplay()

    // add DrawPool state at the end after using it to initialize the other GameElementStates
    this.gameElementStates.pile.push(this.elementDrawPool.state)
    return this.gameElementStates
  }

  buildElementDrawPool(): Pile {
    return new Pile(
      {
        id: PileIdEnum.ELEMENT,
        owner: null,
        inventory: {
          // 20 Elements each, with 2 being places on Earth, leaving 18 in the bag
          [ElementEnum.GRASS]: 18,
          [ElementEnum.GRUB]: 18,
          [ElementEnum.MEAT]: 18,
          [ElementEnum.SEED]: 18,
          [ElementEnum.SUN]: 18,
          [ElementEnum.WATER]: 18,
        },
      }
    )
  }


  buildAdaptionActionDisplay(): Area {
    const adaptionActionDisplayArea = new Area({
      id: AreaIdEnum.ACTION_DISPLAY_ADAPTION,
      space: [
        {kind: SpaceKindEnum.ELEMENT, piece: null},
        {kind: SpaceKindEnum.ELEMENT, piece: null},
        {kind: SpaceKindEnum.ELEMENT, piece: null},
        {kind: SpaceKindEnum.ELEMENT, piece: null},
        {kind: SpaceKindEnum.ACTION_PAWN, piece: null},
        {kind: SpaceKindEnum.ACTION_PAWN, piece: null},
        {kind: SpaceKindEnum.ACTION_PAWN, piece: null},
      ],
    })
    this.elementDrawPool.pullMany(4).forEach((element) => {
      if (element) {
        const nextSpace = adaptionActionDisplayArea.nextAvailableSpace(SpaceKindEnum.ELEMENT)
        if (nextSpace) {
          nextSpace.addPiece(element);
        } else {
          throw new Error('No Spaces available');
        }
      } else {
        throw new Error('Drawpool empty for initialization')
      }
    })
    return adaptionActionDisplayArea
  }

  private buildActionDisplay(): void {
    this.gameElementStates.area.push(this.buildAdaptionActionDisplay().state)
  }


  private buildFactions(
    playerIds: string[]
  ): void {
    const shuffledAnimals = shuffle(Object.values(AnimalEnum));
    playerIds.forEach((playerId: string, index) => {
      const assignedAnimal = shuffledAnimals[index];
      const elementConfig = getOrThrow(elementConfigByAnimal, assignedAnimal);

      this.gameElementStates.faction.push({
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

      this.gameElementStates.area.push({
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
      this.gameElementStates.pile.push(actionPawnPileState);

      const speciesPileState = {
        id: getOrThrow(pileIdsByAnimal, assignedAnimal).species,
        owner: assignedAnimal,
        inventory: {
          [PieceKindEnum.SPECIES]: 65 - playerIds.length * 5,
        },
      };
      this.gameElementStates.pile.push(speciesPileState);
    });
  }
}
