import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionPawnPiece } from '../../model/action-pawn.model';
import { imgPathByKind } from '../../constant/image.constant';
import { getOrThrow } from '../../../engine/util';

@Component({
  selector: 'app-action-pawn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './action-pawn.component.html',
  styleUrl: './action-pawn.component.scss',
})
export class ActionPawnComponent {
  @Input() actionPawn: ActionPawnPiece | undefined = undefined;

  get owner(): string | null | undefined {
    return this.actionPawn?.owner;
  }

  get name(): string | undefined {
    return this.actionPawn?.name;
  }

  get imgPath(): string | undefined {
    if (this.owner) {
      return getOrThrow(imgPathByKind, this.owner);
    } else {
      return undefined;
    }
  }
}
