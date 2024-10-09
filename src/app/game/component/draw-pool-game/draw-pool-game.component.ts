import { Component } from '@angular/core';
import { GameManagementService } from '../../../engine/service/game-management.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStateService } from '../../../engine/service/game-state.service';
import { dsPieceKind } from '../../dominant-species.constants';
import { filter } from 'rxjs';
import {PileRegistryService} from "../../../engine/service/pile-registry.service";
import {Pile} from "../../../engine/model/pile.model";
import {ElementDrawPoolService} from "../../service/element-draw-pool.service";

@Component({
  selector: 'app-draw-pool-game',
  standalone: true,
  imports: [MatButton, MatTooltip],
  templateUrl: './draw-pool-game.component.html',
  styleUrl: './draw-pool-game.component.scss',
})
export class DrawPoolGameComponent {
  drawPool: Pile | null = null
  drawPoolLength = 0;
  log: string[] = [];
  constructor(
    private gameManagementSvc: GameManagementService,
    private gameStateSvc: GameStateService,
    private elementDrawPoolSvc: ElementDrawPoolService
  ) {
    this.initialize();
  }

  private initialize(): void {
    const registeredPilesSubscription = this.elementDrawPoolSvc.drawPool$
      .pipe(filter((drawPool) => drawPool != null))
      .subscribe((drawPool) => {
        this.drawPool = drawPool
        drawPool.length$.subscribe((length) => {this.drawPoolLength = length})
        registeredPilesSubscription.unsubscribe();
      });
  }

  createGame(): void {
    console.log('Create Game');
    this.gameManagementSvc.createGame();
  }

  startTurn(): void {
    console.log('Start Turn');
    this.gameStateSvc.startTransaction();
  }

  private formatElementName(kind: string): string {
    const elementName = kind.replace('Element', '');
    return elementName.charAt(0).toUpperCase() + elementName.slice(1);
  }

  draw(): void {
    if (this.drawPool) {
      const item = this.drawPool.pull();
      if (item[0]) {
        const element = this.formatElementName(item[0].kind);
        this.log.push(`You drew a ${element}`);
      } else {
        this.log.push('Pile is empty!');
      }
    }

  }

  endTurn(): void {
    console.log('End Turn');
    this.gameStateSvc.commitTransaction();
  }
}
