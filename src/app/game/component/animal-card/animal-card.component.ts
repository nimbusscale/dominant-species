import { Component, Input, OnInit } from '@angular/core';
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
import { Animal } from '../../model/animal.model';
import { isNotUndefined } from '../../../engine/util/predicate';

// Todo: change to OnPush
@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [MatCard, MatCardTitle, ActionPawnComponent, MatGridList, MatGridTile, ElementComponent],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss',
})
export class AnimalCardComponent implements OnInit {
  @Input() faction: Faction | undefined = undefined;
  animal: Animal | undefined = undefined;
  elements: ElementPiece[] = [];
  emptyElementSpaces: null[] = [];
  actionPawnPileLength = 0;
  speciesPileLength = 0;
  actionPawnForHeader: ActionPawnPiece | undefined = undefined;

  constructor(private animalProviderService: AnimalProviderService) {}

  ngOnInit() {
    if (!this.faction) {
      throw new Error('faction not set');
    }
    this.setActionPawnForHeader(this.faction);
    this.getAnimal(this.faction);
  }

  private getAnimal(faction: Faction): void {
    this.animalProviderService.animals$
      .pipe(
        // filter((animals) => animals.some((animal) => animal.id === faction.id)),
        map((animals) => animals.find((animal) => animal.id === faction.id)),
        filter(isNotUndefined),
        first(),
      )
      .subscribe((animal) => {
        this.animal = animal;
        animal.elements.elements$.subscribe((elements) => {
          this.elements = elements;
          this.emptyElementSpaces = Array(6 - this.elements.length).fill(null) as null[];
        });
        animal.actionPawn.length$.subscribe((length) => {
          this.actionPawnPileLength = length;
        });
        animal.species.length$.subscribe((length) => {
          this.speciesPileLength = length;
        });
      });
  }

  private setActionPawnForHeader(faction: Faction): void {
    this.actionPawnForHeader = defaultPieceFactory(
      PieceKindEnum.ACTION_PAWN,
      faction.id,
    ) as ActionPawnPiece;
  }
}
