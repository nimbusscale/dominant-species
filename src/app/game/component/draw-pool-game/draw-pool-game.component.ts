import { Component } from '@angular/core';
import { GameManagementService } from '../../../engine/service/game-management.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStateService } from '../../../engine/service/game-state/game-state.service';
import { filter, first } from 'rxjs';
import { Pile } from '../../../engine/model/pile.model';
import { ElementDrawPoolService } from '../../service/element-draw-pool.service';

import { FactionRegistryService } from '../../../engine/service/game-element/faction-registry.service';

@Component({
  selector: 'app-draw-pool-game',
  standalone: true,
  imports: [MatButton, MatTooltip],
  templateUrl: './draw-pool-game.component.html',
  styleUrl: './draw-pool-game.component.scss',
})
export class DrawPoolGameComponent {
  drawPool: Pile | null = null;
  drawPoolLength = 0;
  log: string[] = [];
  constructor(
    private gameManagementSvc: GameManagementService,
    private gameStateSvc: GameStateService,
    private elementDrawPoolSvc: ElementDrawPoolService,
    private factionRegistrySvc: FactionRegistryService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.elementDrawPoolSvc.drawPool$
      .pipe(
        filter((drawPool) => drawPool != null),
        first(),
      )
      .subscribe((drawPool) => {
        this.drawPool = drawPool;
        drawPool.length$.subscribe((length) => {
          this.drawPoolLength = length;
        });
      });
  }

  createGame(): void {
    this.gameManagementSvc.createGame();
    console.log('Create Game');
    this.factionRegistrySvc.registeredIds$.subscribe((ids) => {
      this.log.push(`Welcome ${Array.from(ids)[0]}!`);
    });
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
