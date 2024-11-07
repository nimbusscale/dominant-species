import { Component, OnInit } from '@angular/core';
import { DrawPoolGameComponent } from '../draw-pool-game/draw-pool-game.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../engine/service/game-management/game.service';

@Component({
  selector: 'app-dominant-species-game',
  standalone: true,
  imports: [DrawPoolGameComponent],
  templateUrl: './dominant-species-game.component.html',
  styleUrl: './dominant-species-game.component.scss',
})
export class DominantSpeciesGameComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.queryParamMap.get('gameId');
    if (!gameId) {
      void this.router.navigate(['/lobby']);
    } else {
      void this.initializeGame(gameId);
    }
  }

  private async initializeGame(gameId: string): Promise<void> {
    await this.gameService.initializeGame(gameId);
  }
}
