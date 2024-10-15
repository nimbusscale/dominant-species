import {Component, Input} from '@angular/core';
import {ElementPiece} from "../../../model/element.model";
import {getOrThrow} from "../../../../engine/util";
import {imgPathByKind} from "../../../constant/image.constant";

@Component({
  selector: 'app-element-space',
  standalone: true,
  imports: [],
  templateUrl: './element-space.component.html',
  styleUrl: './element-space.component.scss'
})
export class ElementSpaceComponent {
  @Input() element: ElementPiece | null = null

  get imgPath(): string {
      return getOrThrow(imgPathByKind, 'elementSpace');
  }

}
