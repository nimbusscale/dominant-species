import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { ElementPiece } from '../../../../model/element.model';
import { getOrThrow } from '../../../../../engine/util/misc';
import { imgPathByKind } from '../../../../constant/image.constant';
import { ElementComponent } from '../../../element/element.component';
import { Space } from '../../../../../engine/model/space.model';

@Component({
  selector: 'app-element-space',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ElementComponent],
  templateUrl: './element-space.component.html',
  styleUrl: './element-space.component.scss',
})
export class ElementSpaceComponent implements OnInit {
  space = input.required<Space>();
  element = signal<ElementPiece | undefined>(undefined);
  hasAction = signal<boolean>(false);

  ngOnInit() {
    this.space().space$.subscribe((space) => {
      if (space.piece) {
        this.element.set(space.piece as ElementPiece);
      } else {
        this.element.set(undefined);
      }
      this.hasAction.set(space.actions.length > 0);
    });
  }

  performAction(): void {
    if (this.space().actions.length > 0) {
      this.space().actions[0].execute();
    } else {
      throw new Error('No action to perform');
    }
  }

  get imgPath(): string {
    return getOrThrow(imgPathByKind, 'elementSpace');
  }
}
