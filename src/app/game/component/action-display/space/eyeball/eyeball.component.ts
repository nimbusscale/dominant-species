import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getOrThrow } from '../../../../../engine/util/misc';
import { imgPathByKind } from '../../../../constant/image.constant';

@Component({
  selector: 'app-eyeball',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './eyeball.component.html',
  styleUrl: './eyeball.component.scss',
})
export class EyeballComponent {
  get imgPath(): string {
    return getOrThrow(imgPathByKind, 'eyeball');
  }
}
