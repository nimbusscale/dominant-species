import {Component, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {ElementSpaceComponent} from "../element-space/element-space.component";
import {EyeballComponent} from "../eyeball/eyeball.component";
import {ActionPawnSpaceComponent} from "../action-pawn-space/action-pawn-space.component";
import {AreaRegistryService} from "../../../../engine/service/game-element/area-registry.service";
import {Area} from "../../../../engine/model/area.model";
import {filter, first} from "rxjs";
import {AreaIdEnum, SpaceKindEnum} from "../../../constant/area.constant";
import {ElementPiece} from "../../../model/element.model";
import {ActionPawnPiece} from "../../../model/action-pawn.model";

@Component({
  selector: 'app-adaption-action-display-card',
  standalone: true,
  imports: [
    MatCard,
    ElementSpaceComponent,
    EyeballComponent,
    ActionPawnSpaceComponent
  ],
  templateUrl: './adaption-action-display-card.component.html',
  styleUrl: './adaption-action-display-card.component.scss'
})
export class AdaptionActionDisplayCardComponent implements OnInit {
  area: Area | undefined = undefined
  elements: ElementPiece[] = []
  actionPawns: ActionPawnPiece[] = []

  constructor(
    private areaRegistryService: AreaRegistryService
  ) {
  }

  ngOnInit() {
    this.areaRegistryService.registeredIds$.pipe(
      filter((ids) => ids.has(AreaIdEnum.ACTION_DISPLAY_ADAPTION)),
      first(),
    ).subscribe(() => {
      this.area = this.areaRegistryService.get(AreaIdEnum.ACTION_DISPLAY_ADAPTION)
      this.elements = this.area.spaces.filter((space) => space.kind === SpaceKindEnum.ELEMENT).map((space) => space.piece) as ElementPiece[]
      this.actionPawns = this.area.spaces.filter((space) => space.kind === SpaceKindEnum.ACTION_PAWN).map((space) => space.piece) as ActionPawnPiece[]
    })
  }

}
