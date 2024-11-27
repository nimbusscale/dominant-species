import {ChangeDetectionStrategy, Component, computed, input, OnInit, signal} from '@angular/core';
import { ActionPawnComponent } from '../../../action-pawn/action-pawn.component';
import { EyeballComponent } from '../eyeball/eyeball.component';
import {Space} from "../../../../../engine/model/space.model";
import {ActionPawnPiece} from "../../../../model/action-pawn.model";

@Component({
  selector: 'app-action-pawn-space',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionPawnComponent, EyeballComponent],
  templateUrl: './action-pawn-space.component.html',
  styleUrl: './action-pawn-space.component.scss',
})
export class ActionPawnSpaceComponent implements OnInit {
  space = input.required<Space>()
  actionPawn = signal<ActionPawnPiece | undefined>(undefined)
  hasAction = signal<boolean>(false)

  ngOnInit() {
    this.space().space$.subscribe((space) => {
      if (space.piece) {
        this.actionPawn.set(space.piece as ActionPawnPiece)
      } else {
        this.actionPawn.set(undefined)
      }
      this.hasAction.set(space.actions.length > 0)
    })
  }

  performAction(): void {
    if (this.space().actions.length > 0) {
      this.space().actions[0].execute()
    } else {
      throw new Error("No action to perform")
    }
  }
}
