import { Injectable } from '@angular/core';
import { baseGameState, dsAnimal } from '../../game/dominant-species.constants';
import { Pile } from '../model/pile.model';
import {
  AreaRegistryService,
  FactionRegistryService,
  PileRegistryService,
} from './game-element-registry.service';
import { Space } from '../model/space.model';
import { Area } from '../model/area.model';
import { PlayerState } from '../model/player.model';
import { shuffle } from 'lodash';
import { Faction } from '../model/faction.model';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private factionRegistrySvc: FactionRegistryService,
    private pileRegistrySvc: PileRegistryService,
  ) {}

  createGame(): void {
    this.createArea();
    this.createPile();
    this.createFactions(baseGameState.global.player);
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

  private createFactions(players: PlayerState[]) {
    const factions: Faction[] = [];
    const shuffledAnimals = shuffle(Object.values(dsAnimal));
    players.forEach((player, index) => {
      factions.push(
        new Faction({
          id: shuffledAnimals[index] as string,
          ownerId: player.id,
          score: 0,
        }),
      );
    });
    this.factionRegistrySvc.register(factions);
  }

  private createPile(): void {
    const piles: Pile[] = [];
    baseGameState.pile.forEach((pileState) => {
      piles.push(new Pile(pileState));
    });
    this.pileRegistrySvc.register(piles);
  }
}
