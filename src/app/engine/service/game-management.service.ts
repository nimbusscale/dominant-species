import { Injectable } from '@angular/core';
import { baseGameState } from '../../game/dominant-species.constants';
import { Pile } from '../model/pile.model';
import { AreaRegistryService, PileRegistryService } from './game-element-registry.service';
import { Space } from '../model/space.model';
import { Area } from '../model/area.model';
import { PlayerState } from '../model/player.model';

@Injectable({
  providedIn: 'root',
})
export class GameManagementService {
  constructor(
    private areaRegistrySvc: AreaRegistryService,
    private pileRegistrySvc: PileRegistryService,
  ) {}

  createGame(): void {
    this.createArea();
    this.createPile();
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
    console.log(players);
  }

  private createPile(): void {
    const piles: Pile[] = [];
    baseGameState.pile.forEach((pileState) => {
      piles.push(new Pile(pileState));
    });
    this.pileRegistrySvc.register(piles);
  }
}
