import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ActionPawnPiece} from "../../../model/action-pawn.model";
import {ElementComponent} from "../../element/element.component";
import {ActionPawnComponent} from "../../action-pawn/action-pawn.component";
import {EyeballComponent} from "../eyeball/eyeball.component";

@Component({
  selector: 'app-action-pawn-space',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ElementComponent,
    ActionPawnComponent,
    EyeballComponent
  ],
  templateUrl: './action-pawn-space.component.html',
  styleUrl: './action-pawn-space.component.scss'
})
export class ActionPawnSpaceComponent {
  @Input() actionPawn: ActionPawnPiece | null = null
}
