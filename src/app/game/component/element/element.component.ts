import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ElementPiece} from "../../model/element.model";

import {ElementEnum, elementImgPathByElementKind} from "../../constant/element.constant";

@Component({
  selector: 'app-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss'
})
export class ElementComponent {
  @Input() element: ElementPiece | null = {kind: ElementEnum.GRASS, owner: null, name: 'Grass'}

  get kind(): string | undefined {
    return this.element?.kind
  }

  get name(): string | undefined {
    return this.element?.name
  }

  get imgPath(): string | undefined {
    if (this.kind) {
      return elementImgPathByElementKind.get(this.kind)
    } else {
      return undefined
    }
  }

}
