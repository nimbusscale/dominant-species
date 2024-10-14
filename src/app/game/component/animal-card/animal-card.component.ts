import {Component, Input, OnInit} from '@angular/core';
import {MatCard, MatCardTitle} from "@angular/material/card";
import {defaultPieceFactory} from "../../../engine/model/piece.model";
import {PieceKindEnum} from "../../constant/piece.constant";
import {ActionPawnPiece} from "../../model/action-pawn.model";
import {ActionPawnComponent} from "../action-pawn/action-pawn.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AreaRegistryService} from "../../../engine/service/game-element/area-registry.service";
import {Faction} from "../../../engine/model/faction.model";
import {Area} from "../../../engine/model/area.model";
import {Pile} from "../../../engine/model/pile.model";
import {PileRegistryService} from "../../../engine/service/game-element/pile-registry.service";
import {filter, first} from "rxjs";
import {getOrThrow} from "../../../engine/util";
import {elementAreaIdsByAnimal} from "../../constant/area.constant";
import {pileIdsByAnimal} from "../../constant/pile.constant";

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    ActionPawnComponent,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss'
})
export class AnimalCardComponent implements OnInit {
  @Input() faction: Faction | undefined = undefined
  elementArea: Area | undefined = undefined
  actionPawnPile: Pile | undefined = undefined
  speciesPile: Pile | undefined = undefined
  actionPawn = defaultPieceFactory(PieceKindEnum.ACTION_PAWN, 'bird') as ActionPawnPiece

  constructor(
    private areaRegistryService: AreaRegistryService,
    private pileRegistryService: PileRegistryService
  ) {
  }

  ngOnInit() {
    if (!this.faction) {
      throw new Error('faction not set')
    }
    this.getElementArea(this.faction)
    this.getActionPawnPile(this.faction)
    this.getSpeciesPile(this.faction)
  }

  private getElementArea(faction: Faction): void {
    const elementAreaId = getOrThrow(elementAreaIdsByAnimal, faction.id)
    this.areaRegistryService.registeredIds$.pipe(
      filter((ids) => ids.has(elementAreaId)),
      first()
    ).subscribe(() => {
      this.elementArea = this.areaRegistryService.get(elementAreaId)
    }
    )
  }

  private getActionPawnPile(faction: Faction): void {
    const actionPawnPileId = getOrThrow(pileIdsByAnimal, faction.id)['actionPawn']
    this.pileRegistryService.registeredIds$.pipe(
      filter((ids) => ids.has(actionPawnPileId)),
      first()
    ).subscribe(() => {
      this.actionPawnPile = this.pileRegistryService.get(actionPawnPileId)
    })
  }

  private getSpeciesPile(faction: Faction): void {
    const actionPawnPileId = getOrThrow(pileIdsByAnimal, faction.id)['species']
    this.pileRegistryService.registeredIds$.pipe(
      filter((ids) => ids.has(actionPawnPileId)),
      first()
    ).subscribe(() => {
      this.speciesPile = this.pileRegistryService.get(actionPawnPileId)
    })
  }

}
