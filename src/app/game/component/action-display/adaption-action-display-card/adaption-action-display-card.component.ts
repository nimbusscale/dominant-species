import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { ElementSpaceComponent } from '../space/element-space/element-space.component';
import { EyeballComponent } from '../space/eyeball/eyeball.component';
import { ActionPawnSpaceComponent } from '../space/action-pawn-space/action-pawn-space.component';
import { ElementPiece } from '../../../model/element.model';
import { ActionPawnPiece } from '../../../model/action-pawn.model';
import { AdaptionActionDisplayService } from '../../../service/action-display/adaption-action-display.service';
import { filter, first } from 'rxjs';
import { isTrue } from '../../../../engine/util/predicate';

@Component({
  selector: 'app-adaption-action-display-card',
  standalone: true,
  imports: [MatCard, ElementSpaceComponent, EyeballComponent, ActionPawnSpaceComponent],
  templateUrl: './adaption-action-display-card.component.html',
  styleUrl: './adaption-action-display-card.component.scss',
})
export class AdaptionActionDisplayCardComponent implements OnInit {
  actionPawns: (ActionPawnPiece | null)[] = [];
  elements: (ElementPiece | null)[] = [];

  constructor(private adaptionActionDisplayService: AdaptionActionDisplayService) {}

  ngOnInit() {
    this.adaptionActionDisplayService.ready$.pipe(filter(isTrue), first()).subscribe(() => {
      this.adaptionActionDisplayService.actionPawns$.subscribe((actionPawns) => {
        this.actionPawns = actionPawns;
      });
      this.adaptionActionDisplayService.elements$.subscribe((elements) => {
        this.elements = elements;
      });
      this.adaptionActionDisplayService.setup();
    });
  }
}
