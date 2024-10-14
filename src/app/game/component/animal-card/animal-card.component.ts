import { Component } from '@angular/core';
import {MatCard, MatCardTitle} from "@angular/material/card";
import {defaultPieceFactory} from "../../../engine/model/piece.model";
import {PieceKindEnum} from "../../constant/piece.constant";
import {ActionPawnPiece} from "../../model/action-pawn.model";
import {ActionPawnComponent} from "../action-pawn/action-pawn.component";

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    ActionPawnComponent
  ],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss'
})
export class AnimalCardComponent {
  actionPawn = defaultPieceFactory(PieceKindEnum.ACTION_PAWN, 'bird') as ActionPawnPiece

}
