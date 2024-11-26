import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import { ElementComponent } from '../../../element/element.component';
import { ActionPawnComponent } from '../../../action-pawn/action-pawn.component';
import { EyeballComponent } from '../eyeball/eyeball.component';
import {Space} from "../../../../../engine/model/space.model";
import {ActionPawnPiece} from "../../../../model/action-pawn.model";

@Component({
  selector: 'app-action-pawn-space',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ElementComponent, ActionPawnComponent, EyeballComponent],
  templateUrl: './action-pawn-space.component.html',
  styleUrl: './action-pawn-space.component.scss',
})
export class ActionPawnSpaceComponent {
  space = input.required<Space>()
  actionPawn = computed(() => {
    if (this.space().piece) {
      return this.space().piece as ActionPawnPiece
    } else {
      /**
       * Ideally we would return None, but '@if (actionPawn())' doesn't "narrow" the returned type in the template, so we have to return
       * a compatible type for ActionPawnComponent, which in this case is undefined.
       */
      return undefined
    }
  })
  hasAction = computed(() => {
    return this.space().actions.length > 0;
  })

  performAction(): void {
    if (this.space().actions.length > 0) {
      this.space().actions[0].execute()
    } else {
      throw new Error("No action to perform")
    }
  }
}
