import { Component } from '@angular/core';
import { GameManagementService } from '../../../engine/service/game-management.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStateService } from '../../../engine/service/game-state.service';
import { ElementDrawPoolService } from '../../service/element-draw-pool.service';

@Component({
  selector: 'app-draw-pool-game',
  standalone: true,
  imports: [MatButton, MatTooltip],
  templateUrl: './draw-pool-game.component.html',
  styleUrl: './draw-pool-game.component.scss',
})
export class DrawPoolGameComponent {
  drawPoolLength = 0;
  log: string[] = [];
  constructor(
    private gameManagementSvc: GameManagementService,
    private gameStateSvc: GameStateService,
    private drawPoolSvc: ElementDrawPoolService,
  ) {
    this.drawPoolSvc.length$.subscribe((length) => {
      this.drawPoolLength = length;
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

  draw(): void {
    const item = this.drawPoolSvc.pull();
    if (item[0]) {
      let element = item[0].kind.replace('Element', '');
      element = element.charAt(0).toUpperCase() + element.slice(1);
      this.log.push(`You drew a ${element}`);
    } else {
      this.log.push('Pile is empty!');
    }
  }

  endTurn(): void {
    console.log('End Turn');
    this.gameStateSvc.commitTransaction();
  }
}
