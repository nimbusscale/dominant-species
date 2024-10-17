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
import { ElementPiece } from '../../model/element.model';
import { ElementEnum } from '../../constant/element.constant';
import { Faction } from '../../../engine/model/faction.model';
import { ActionPawnComponent } from '../action-pawn/action-pawn.component';
import { AnimalEnum } from '../../constant/animal.constant';
import { PieceKindEnum } from '../../constant/piece.constant';
import { defaultPieceFactory } from '../../../engine/model/piece.model';
import { ActionPawnPiece } from '../../model/action-pawn.model';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { PlayerService } from '../../../engine/service/player.service';
import { EyeballComponent } from '../action-display/eyeball/eyeball.component';
import { ElementSpaceComponent } from '../action-display/element-space/element-space.component';
import { AdaptionActionDisplayCardComponent } from '../action-display/adaption-action-display-card/adaption-action-display-card.component';
import { AreaRegistryService } from '../../../engine/service/game-element/area-registry.service';
import { Area } from '../../../engine/model/area.model';
import { AreaIdEnum, SpaceKindEnum } from '../../constant/area.constant';

@Component({
  selector: 'app-draw-pool-game',
  standalone: true,
  imports: [
    MatButton,
    MatTooltip,
    ElementComponent,
    ActionPawnComponent,
    AnimalCardComponent,
    EyeballComponent,
    ElementSpaceComponent,
    AdaptionActionDisplayCardComponent,
  ],
  templateUrl: './draw-pool-game.component.html',
  styleUrl: './draw-pool-game.component.scss',
})
export class DrawPoolGameComponent {
  currentPlayerFaction: Faction | undefined = undefined;
  factions: Faction[] = [];
  drawPool: Pile | undefined = undefined;
  drawPoolLength = 0;
  adaptionArea: Area | undefined = undefined;
  log: string[] = [];
  constructor(
    private gameManagementSvc: GameManagementService,
    private gameStateSvc: GameStateService,
    private elementDrawPoolSvc: ElementDrawPoolService,
    private factionRegistrySvc: FactionRegistryService,
    private playerService: PlayerService,
    private areaRegistryService: AreaRegistryService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    // this.elementDrawPoolSvc.drawPool$
    //   .pipe(
    //     filter((drawPool) => drawPool != null),
    //     first(),
    //   )
    //   .subscribe((drawPool) => {
    //     this.drawPool = drawPool;
    //     drawPool.length$.subscribe((length) => {
    //       this.drawPoolLength = length;
    //     });
    //   });
    this.areaRegistryService.registeredIds$
      .pipe(
        filter((ids) => ids.has(AreaIdEnum.ACTION_DISPLAY_ADAPTION)),
        first(),
      )
      .subscribe(() => {
        this.adaptionArea = this.areaRegistryService.get(AreaIdEnum.ACTION_DISPLAY_ADAPTION);
      });
  }

  createGame(): void {
    this.gameManagementSvc.createGame();
    console.log('Create Game');
    // should be using factionAssignments$
    this.factionRegistrySvc.factionAssignment$.subscribe((factionAssignments) => {
      const factionAssignment = factionAssignments[0];
      this.factions = [this.factionRegistrySvc.get(factionAssignment.id)];

      // this.factions = factionAssignments.map((factionAssignment) =>
      //   this.factionRegistrySvc.get(factionAssignment.id),
      // );
      this.currentPlayerFaction = this.factions.find(
        (faction) => faction.ownerId === this.playerService.currentPlayer.id,
      );
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
    if (this.drawPool && this.adaptionArea) {
      const item = this.drawPool.pull();
      if (item[0]) {
        const nextSpace = this.adaptionArea.nextAvailableSpace(SpaceKindEnum.ELEMENT);
        if (nextSpace) {
          nextSpace.addPiece(item[0] as ElementPiece);
        }
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
    for (const elementKind of Object.values(ElementEnum) as ElementEnum[]) {
      elements.push(defaultPieceFactory(elementKind) as ElementPiece);
    }
    return elements;
  }

  get actionPawns(): ActionPawnPiece[] {
    const actionPawns: ActionPawnPiece[] = [];
    for (const animal of Object.values(AnimalEnum) as AnimalEnum[]) {
      actionPawns.push(defaultPieceFactory(PieceKindEnum.ACTION_PAWN, animal) as ActionPawnPiece);
    }
    return actionPawns;
  }
}
