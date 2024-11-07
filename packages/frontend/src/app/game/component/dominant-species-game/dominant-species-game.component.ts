import {Component, OnInit} from '@angular/core';
import {DrawPoolGameComponent} from "../draw-pool-game/draw-pool-game.component";
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../../engine/service/game-management/game.service";

@Component({
  selector: 'app-dominant-species-game',
  standalone: true,
  imports: [
    DrawPoolGameComponent
  ],
  templateUrl: './dominant-species-game.component.html',
  styleUrl: './dominant-species-game.component.scss'
})
export class DominantSpeciesGameComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
  ) {
  }

  async ngOnInit() {
    const gameId = this.route.snapshot.queryParamMap.get('gameId')
    if (!gameId) {
      await this.router.navigate(['/lobby'])
    } else {
      await this.gameService.initializeGame(gameId)
    }
  }
}
