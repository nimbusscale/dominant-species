import { Component } from '@angular/core';
import {DrawPoolGameComponent} from "../draw-pool-game/draw-pool-game.component";

@Component({
  selector: 'app-dominant-species-game',
  standalone: true,
  imports: [
    DrawPoolGameComponent
  ],
  templateUrl: './dominant-species-game.component.html',
  styleUrl: './dominant-species-game.component.scss'
})
export class DominantSpeciesGameComponent {

}
