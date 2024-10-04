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
  constructor(
    private gameManagementSvc: GameManagementService,
    private gameStateSvc: GameStateService,
    private drawPoolSvc: ElementDrawPoolService,
  ) {}

  createGame(): void {
    console.log('Create Game');
    this.gameManagementSvc.createGame();
  }

  startTurn(): void {
    console.log('Start Turn');
    this.gameStateSvc.startTransaction();
  }

  draw(): void {
    console.log('Draw!');
    console.log(this.drawPoolSvc.pull());
  }

  endTurn(): void {
    console.log('End Turn');
    this.gameStateSvc.commitTransaction();
  }
}
