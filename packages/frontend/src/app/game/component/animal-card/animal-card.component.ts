import { ChangeDetectionStrategy, Component, computed, input, OnInit, signal } from '@angular/core';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { defaultPieceFactory } from '../../../engine/model/piece.model';
import { PieceKindEnum } from '../../constant/piece.constant';
import { ActionPawnPiece } from '../../model/action-pawn.model';
import { ActionPawnComponent } from '../action-pawn/action-pawn.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Faction } from '../../../engine/model/faction.model';
import { filter, first, map } from 'rxjs';
import { ElementPiece } from '../../model/element.model';
import { ElementComponent } from '../element/element.component';
import { AnimalProviderService } from '../../service/animal-provider.service';
import { isNotUndefined } from '../../../engine/util/predicate';
import { PlayerService } from '../../../engine/service/game-management/player.service';
import { NgClass } from '@angular/common';
import {ensureDefined} from "../../../engine/util/misc";

// Todo: change to OnPush
@Component({
  selector: 'app-animal-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardTitle,
    ActionPawnComponent,
    MatGridList,
    MatGridTile,
    ElementComponent,
    NgClass,
  ],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss',
})
export class AnimalCardComponent implements OnInit {
  faction = input.required<Faction>();
  elements = signal<ElementPiece[]>([]);
  emptyElementSpaces = signal<null[]>([]);
  actionPawnPileLength = signal(0);
  speciesPileLength = signal(0);
  actionPawnForHeader = computed(() => this.getActionPawnForHeader());
  currentPlayerAnimal = computed(
    () => this.faction().ownerId === ensureDefined(this.playerService.currentPlayer).username,
  );

  constructor(
    private animalProviderService: AnimalProviderService,
    private playerService: PlayerService,
  ) {}

  ngOnInit() {
    this.getAnimal();
  }

  private getAnimal(): void {
    this.animalProviderService.animals$
      .pipe(
        map((animals) => animals.find((animal) => animal.id === this.faction().id)),
        filter(isNotUndefined),
        first(),
      )
      .subscribe((animal) => {
        animal.elements.elements$.subscribe((elements) => {
          this.elements.set(elements);
          this.emptyElementSpaces.set(Array(6 - elements.length).fill(null) as null[]);
        });
        animal.actionPawn.length$.subscribe((length) => {
          this.actionPawnPileLength.set(length);
        });
        animal.species.length$.subscribe((length) => {
          this.speciesPileLength.set(length);
        });
      });
  }

  private getActionPawnForHeader(): ActionPawnPiece {
    return defaultPieceFactory(PieceKindEnum.ACTION_PAWN, this.faction().id) as ActionPawnPiece;
  }
}
