import {Component, Input} from '@angular/core';
import {ElementPiece} from "../../../model/element.model";
import {getOrThrow} from "../../../../engine/util";
import {imgPathByKind} from "../../../constant/image.constant";
import {ElementComponent} from "../../element/element.component";
import {defaultPieceFactory} from "../../../../engine/model/piece.model";
import {ElementEnum} from "../../../constant/element.constant";

@Component({
  selector: 'app-element-space',
  standalone: true,
  imports: [
    ElementComponent
  ],
  templateUrl: './element-space.component.html',
  styleUrl: './element-space.component.scss'
})
export class ElementSpaceComponent {
  @Input() element: ElementPiece | null = null

  get imgPath(): string {
      return getOrThrow(imgPathByKind, 'elementSpace');
  }

}
