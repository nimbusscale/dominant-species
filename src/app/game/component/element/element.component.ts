import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ElementPiece } from '../../model/element.model';

import { imgPathByKind } from '../../constant/image.constant';
import { getOrThrow } from '../../../engine/util/misc';

@Component({
  selector: 'app-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss',
})
export class ElementComponent {
  @Input() element: ElementPiece | undefined = undefined;

  get kind(): string | undefined {
    return this.element?.kind;
  }

  get name(): string | undefined {
    return this.element?.name;
  }

  get imgPath(): string | undefined {
    if (this.kind) {
      return getOrThrow(imgPathByKind, this.kind);
    } else {
      return undefined;
    }
  }
}
