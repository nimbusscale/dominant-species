import { Injectable } from '@angular/core';
import { Pile, PileState } from '../model/pile.model';
import { Space } from '../model/space.model';
import { Area } from '../model/area.model';
import { shuffle, startCase } from 'lodash';
import { Faction } from '../model/faction.model';
import { PlayerService } from './player.service';
import { getOrThrow } from '../util/misc';
import { AreaRegistryService } from './game-element/area-registry.service';
import { FactionRegistryService } from './game-element/faction-registry.service';
import { PileRegistryService } from './game-element/pile-registry.service';
import { baseGameState } from '../../game/constant/game-state.constant';
import { AnimalEnum } from '../../game/constant/animal.constant';
import { SpaceKindEnum } from '../../game/constant/area.constant';
import { elementConfigByAnimal } from '../../game/constant/element-config.constant';
import { PieceKindEnum } from '../../game/constant/piece.constant';
import { defaultPieceFactory } from '../model/piece.model';
import { pileIdsByAnimal } from '../../game/constant/pile-config';
import { GameStateService } from './game-state/game-state.service';
import { ActionDisplayManagerService } from '../../game/service/action-display/action-display-manager.service';
import { filter } from 'rxjs';
import { isTrue } from '../util/predicate';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private factionRegistrySvc: FactionRegistryService,
    private playerService: PlayerService,
    private pileRegistrySvc: PileRegistryService,
    private gameStateService: GameStateService,
    private actionDisplayManagerService: ActionDisplayManagerService,
  ) {}

  createGame(): void {
    this.createArea();
    this.createFactions();
    this.createDrawPoolPile();
    this.gameStateService.startTransaction();
    this.setup();
    this.gameStateService.commitTransaction();
  }

  private createArea(): void {
    const areas: Area[] = [];
    baseGameState.area.forEach((areaState) => {
      const spaces: Space[] = [];
      areaState.space.forEach((spaceState) => {
        spaces.push(new Space(spaceState.kind));
      });
      areas.push(new Area(areaState.id, spaces));
    });
    this.areaRegistrySvc.register(areas);
  }

  private createFactions() {
    const factions: Faction[] = [];
    const areas: Area[] = [];
    const piles: Pile[] = [];
    const shuffledAnimals = shuffle(Object.values(AnimalEnum));
    this.playerService.players.forEach((player, index) => {
      const assignedAnimal = shuffledAnimals[index];
      const elementConfig = getOrThrow(elementConfigByAnimal, assignedAnimal);

      factions.push(
        new Faction({
          id: assignedAnimal,
          name: startCase(assignedAnimal),
          ownerId: player.id,
          score: 0,
        }),
      );

      const spaces: Space[] = [];
      // inherent element spaces
      for (let i = 0; i < elementConfig.inherentCount; i++) {
        const space = new Space(SpaceKindEnum.ELEMENT);
        space.addPiece(defaultPieceFactory(elementConfig.kind));
        spaces.push(space);
      }

      // added element spaces
      for (let i = 0; i < 6 - elementConfig.inherentCount; i++) {
        const space = new Space(SpaceKindEnum.ELEMENT);
        spaces.push(space);
      }

      areas.push(new Area(elementConfig.areaId, spaces));

      const actionPawnPileState: PileState = {
        id: getOrThrow(pileIdsByAnimal, assignedAnimal).actionPawn,
        owner: assignedAnimal,
        inventory: {
          [PieceKindEnum.ACTION_PAWN]: 7,
        },
      };
      piles.push(new Pile(actionPawnPileState));

      const speciesPileState: PileState = {
        id: getOrThrow(pileIdsByAnimal, assignedAnimal).species,
        owner: assignedAnimal,
        inventory: {
          [PieceKindEnum.SPECIES]: 55,
        },
      };
      piles.push(new Pile(speciesPileState));
    });
    this.factionRegistrySvc.register(factions);
    this.areaRegistrySvc.register(areas);
    this.pileRegistrySvc.register(piles);
  }

  private createDrawPoolPile(): void {
    const piles: Pile[] = [];
    baseGameState.pile.forEach((pileState) => {
      piles.push(new Pile(pileState));
    });
    this.pileRegistrySvc.register(piles);
  }

  private setup(): void {
    this.actionDisplayManagerService.ready$.pipe(filter(isTrue)).subscribe(() => {
      this.actionDisplayManagerService.setup();
    });
  }
}
