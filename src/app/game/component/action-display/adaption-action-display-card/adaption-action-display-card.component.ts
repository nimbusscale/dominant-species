import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {ElementSpaceComponent} from "../element-space/element-space.component";
import {EyeballComponent} from "../eyeball/eyeball.component";
import {ActionPawnSpaceComponent} from "../action-pawn-space/action-pawn-space.component";

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
export class AdaptionActionDisplayCardComponent {

}
