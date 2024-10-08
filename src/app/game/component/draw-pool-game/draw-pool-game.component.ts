import { Component } from '@angular/core';
import { GameManagementService } from '../../../engine/service/game-management.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStateService } from '../../../engine/service/game-state.service';
import { PileService } from '../../../engine/service/pile.service';
import { dsPieceKind } from '../../dominant-species.constants';
import { filter } from 'rxjs';

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
    private pileSvc: PileService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    const registeredPilesSubscription = this.pileSvc.registeredPiles$
      .pipe(filter((registeredPiles) => registeredPiles.has(dsPieceKind.ELEMENT)))
      .subscribe(() => {
        const lengthObservable = this.pileSvc.kindToLengthObservables.get(dsPieceKind.ELEMENT);
        if (lengthObservable) {
          lengthObservable.subscribe((length) => {
            this.drawPoolLength = length;
          });
        } else {
          throw new Error('Length observable for not found');
        }
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
    const item = this.pileSvc.pull(dsPieceKind.ELEMENT);
    if (item[0]) {
      const element = this.formatElementName(item[0].kind);
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
