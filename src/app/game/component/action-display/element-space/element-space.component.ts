import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ElementPiece } from '../../../model/element.model';
import { getOrThrow } from '../../../../engine/util/misc';
import { imgPathByKind } from '../../../constant/image.constant';
import { ElementComponent } from '../../element/element.component';

@Component({
  selector: 'app-element-space',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ElementComponent],
  templateUrl: './element-space.component.html',
  styleUrl: './element-space.component.scss',
})
export class ElementSpaceComponent {
  @Input() element: ElementPiece | null = null;

  get imgPath(): string {
    return getOrThrow(imgPathByKind, 'elementSpace');
  }
}
