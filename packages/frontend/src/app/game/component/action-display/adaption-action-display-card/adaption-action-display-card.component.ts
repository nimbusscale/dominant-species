import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { ElementSpaceComponent } from '../space/element-space/element-space.component';
import { EyeballComponent } from '../space/eyeball/eyeball.component';
import { ActionPawnSpaceComponent } from '../space/action-pawn-space/action-pawn-space.component';
import { AdaptionActionDisplayService } from '../../../service/action-display/adaption-action-display.service';
import { filter, first } from 'rxjs';
import { isTrue } from '../../../../engine/util/predicate';
import { Space } from '../../../../engine/model/space.model';

@Component({
  selector: 'app-adaption-action-display-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, ElementSpaceComponent, EyeballComponent, ActionPawnSpaceComponent],
  templateUrl: './adaption-action-display-card.component.html',
  styleUrl: './adaption-action-display-card.component.scss',
})
export class AdaptionActionDisplayCardComponent implements OnInit {
  actionPawnSpaces = signal<Space[]>([]);
  elementSpaces = signal<Space[]>([]);

  constructor(private adaptionActionDisplayService: AdaptionActionDisplayService) {}

  ngOnInit() {
    this.adaptionActionDisplayService.ready$.pipe(filter(isTrue), first()).subscribe(() => {
      this.adaptionActionDisplayService.actionPawnSpaces$.subscribe((spaces) => {
        this.actionPawnSpaces.set(spaces);
      });
      this.adaptionActionDisplayService.elementSpaces$.subscribe((spaces) => {
        this.elementSpaces.set(spaces);
      });
    });
  }
}
