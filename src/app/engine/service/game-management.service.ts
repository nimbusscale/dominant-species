import { Injectable } from '@angular/core';
import {
  baseGameState,
  dsAnimal,
  dsSpaceKind,
  elementConfigByAnimal,
} from '../../game/dominant-species.constants';
import { Pile } from '../model/pile.model';
import { Space } from '../model/space.model';
import { Area } from '../model/area.model';
import { shuffle } from 'lodash';
import { Faction } from '../model/faction.model';
import { PlayerService } from './player.service';
import { getOrThrow } from '../util';
import { AreaRegistryService } from './game-element/area-registry.service';
import { FactionRegistryService } from './game-element/faction-registry.service';
import { PileRegistryService } from './game-element/pile-registry.service';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private factionRegistrySvc: FactionRegistryService,
    private playerService: PlayerService,
    private pileRegistrySvc: PileRegistryService,
  ) {}

  createGame(): void {
    this.createArea();
    this.createPile();
    this.createFactions();
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
    const shuffledAnimals = shuffle(Object.values(dsAnimal));
    this.playerService.players.forEach((player, index) => {
      const assignedAnimal = shuffledAnimals[index];
      const elementConfig = getOrThrow(elementConfigByAnimal, assignedAnimal);

      factions.push(
        new Faction({
          id: assignedAnimal,
          ownerId: player.id,
          score: 0,
        }),
      );

      const spaces: Space[] = [];
      // inherent element spaces
      for (let i = 0; i < elementConfig.inherentCount; i++) {
        const space = new Space(dsSpaceKind.ELEMENT);
        space.addPiece({ kind: elementConfig.kind });
        spaces.push(space);
      }

      // added element spaces
      for (let i = 0; i < 6 - elementConfig.inherentCount; i++) {
        const space = new Space(dsSpaceKind.ELEMENT);
        spaces.push(space);
      }

      areas.push(new Area(elementConfig.areaId, spaces));
    });
    this.factionRegistrySvc.register(factions);
    this.areaRegistrySvc.register(areas);
  }

  private createPile(): void {
    const piles: Pile[] = [];
    baseGameState.pile.forEach((pileState) => {
      piles.push(new Pile(pileState));
    });
    this.pileRegistrySvc.register(piles);
  }
}
