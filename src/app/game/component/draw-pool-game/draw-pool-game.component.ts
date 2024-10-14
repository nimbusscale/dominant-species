import { Component } from '@angular/core';
import { GameManagementService } from '../../../engine/service/game-management.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStateService } from '../../../engine/service/game-state/game-state.service';
import { filter, first } from 'rxjs';
import { Pile } from '../../../engine/model/pile.model';
import { ElementDrawPoolService } from '../../service/element-draw-pool.service';

import { FactionRegistryService } from '../../../engine/service/game-element/faction-registry.service';
import { ElementComponent } from '../element/element.component';
import { ElementPiece, elementPieceFactory } from '../../model/element.model';
import { ElementEnum } from '../../constant/element.constant';
import { Faction } from '../../../engine/model/faction.model';
import { actionPawnFactory, ActionPawnPiece } from '../../model/action-pawn.model';
import { animalByActionPawnKind } from '../../constant/piece.constant';
import { ActionPawnComponent } from '../action-pawn/action-pawn.component';

@Component({
  selector: 'app-draw-pool-game',
  standalone: true,
  imports: [MatButton, MatTooltip, ElementComponent, ActionPawnComponent],
  templateUrl: './draw-pool-game.component.html',
  styleUrl: './draw-pool-game.component.scss',
})
export class DrawPoolGameComponent {
  faction: Faction | undefined = undefined;
  drawPool: Pile | undefined = undefined;
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
    // should be using factionAssignments$
    this.factionRegistrySvc.registeredIds$.subscribe((ids) => {
      this.faction = this.factionRegistrySvc.get(Array.from(ids)[0]);
      this.log.push(`Welcome ${this.faction.name}!`);
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

  get elements(): ElementPiece[] {
    const elements: ElementPiece[] = [];
    for (const elementKind of Object.values(ElementEnum)) {
      elements.push(elementPieceFactory(elementKind));
    }
    return elements;
  }

  get actionPawns(): ActionPawnPiece[] {
    const actionPawns: ActionPawnPiece[] = [];
    for (const kind of animalByActionPawnKind.keys()) {
      actionPawns.push(actionPawnFactory(kind));
    }
    return actionPawns;
  }
}
