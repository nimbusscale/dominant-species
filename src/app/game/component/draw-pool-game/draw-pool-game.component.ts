import { Component } from '@angular/core';
import { GameManagementService } from '../../../engine/service/game-management.service';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStateService } from '../../../engine/service/game-state/game-state.service';
import { filter, first } from 'rxjs';
import { FactionRegistryService } from '../../../engine/service/game-element/faction-registry.service';
import { ElementComponent } from '../element/element.component';
import { Faction } from '../../../engine/model/faction.model';
import { ActionPawnComponent } from '../action-pawn/action-pawn.component';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { PlayerService } from '../../../engine/service/player.service';
import { EyeballComponent } from '../action-display/space/eyeball/eyeball.component';
import { ElementSpaceComponent } from '../action-display/space/element-space/element-space.component';
import { AdaptionActionDisplayCardComponent } from '../action-display/adaption-action-display-card/adaption-action-display-card.component';
import { AreaRegistryService } from '../../../engine/service/game-element/area-registry.service';
import { Area } from '../../../engine/model/area.model';
import { AreaIdEnum } from '../../constant/area.constant';
import { AnimalProviderService } from '../../service/animal-provider.service';
import { ensureDefined } from '../../../engine/util/misc';
import { AdaptionActionDisplayService } from '../../service/action-display/adaption-action-display.service';

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
  gameStarted = false;
  currentPlayerFaction: Faction | undefined = undefined;
  factions: Faction[] = [];
  adaptionArea: Area | undefined = undefined;
  log: string[] = [];

  constructor(
    private gameManagementSvc: GameManagementService,
    private gameStateSvc: GameStateService,
    private factionRegistrySvc: FactionRegistryService,
    private playerService: PlayerService,
    private areaRegistryService: AreaRegistryService,
    private animalProviderService: AnimalProviderService,
    private adaptionActionDisplayService: AdaptionActionDisplayService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.areaRegistryService.registeredIds$
      .pipe(
        filter((ids) => ids.has(AreaIdEnum.ACTION_DISPLAY_ADAPTION)),
        first(),
      )
      .subscribe(() => {
        this.adaptionArea = this.areaRegistryService.get(AreaIdEnum.ACTION_DISPLAY_ADAPTION);
      });
  }

  startGame(): void {
    this.gameManagementSvc.createGame();
    console.log('Create Game');
    this.factionRegistrySvc.factionAssignment$.subscribe((factionAssignments) => {
      const factionAssignment = factionAssignments[0];
      this.factions = [this.factionRegistrySvc.get(factionAssignment.id)];

      this.factions = factionAssignments.map((factionAssignment) =>
        this.factionRegistrySvc.get(factionAssignment.id),
      );
      // this.currentPlayerFaction = this.factions.find(
      //   (faction) => faction.ownerId === this.playerService.currentPlayer.id,
      // );
    });
    this.gameStarted = true;
  }

  takeAction(): void {
    this.gameStateSvc.startTransaction();
    const animal = this.animalProviderService.get(ensureDefined(this.currentPlayerFaction).id);
    const actionPawn = animal.actionPawn.pullOne();
    if (actionPawn) {
      const nextActionPawnSpaceIndex = this.adaptionActionDisplayService.actionPawns.findIndex(
        (value) => value === null,
      );
      const nextElementSpaceIndex = this.adaptionActionDisplayService.elements.findIndex(
        (value) => value !== null,
      );
      this.adaptionActionDisplayService.addActionPawn(nextActionPawnSpaceIndex, actionPawn);
      const element = this.adaptionActionDisplayService.removeElement(nextElementSpaceIndex);
      animal.elements.addElement(element);
    }
    this.gameStateSvc.commitTransaction();
  }
}
