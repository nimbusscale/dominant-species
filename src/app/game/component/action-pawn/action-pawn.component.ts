import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ActionPawnPiece} from "../../model/action-pawn.model";
import {imgPathByKind} from "../../constant/image.constant";
import {getOrThrow} from "../../../engine/util";

@Component({
  selector: 'app-action-pawn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './action-pawn.component.html',
  styleUrl: './action-pawn.component.scss'
})
export class ActionPawnComponent {
  @Input() actionPawn: ActionPawnPiece | undefined = undefined

  get kind(): string | undefined {
    return this.actionPawn?.kind
  }

  get name(): string | undefined {
    return this.actionPawn?.name
  }

  get imgPath(): string | undefined {
    if (this.kind) {
      return getOrThrow(imgPathByKind, this.kind)
    } else {
      return undefined
    }
  }

}
