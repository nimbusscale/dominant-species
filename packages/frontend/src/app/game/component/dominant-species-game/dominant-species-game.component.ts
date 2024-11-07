import { Component, OnInit, signal } from '@angular/core';
import { DrawPoolGameComponent } from '../draw-pool-game/draw-pool-game.component';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../../engine/service/game-management/game.service';
import { GameReadyService } from '../../service/game-ready.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { filter, first } from 'rxjs';
import { NavigateService } from '../../../engine/service/navigate.service';

@Component({
  selector: 'app-dominant-species-game',
  standalone: true,
  imports: [DrawPoolGameComponent, MatProgressSpinner],
  templateUrl: './dominant-species-game.component.html',
  styleUrl: './dominant-species-game.component.scss',
})
export class DominantSpeciesGameComponent implements OnInit {
  gameReady = signal(false);
  constructor(
    private route: ActivatedRoute,
    private navigate: NavigateService,
    private gameService: GameService,
    private gameReadyService: GameReadyService,
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.queryParamMap.get('gameId');
    if (!gameId) {
      void this.navigate.toLobbyPage();
    } else {
      void this.initializeGame(gameId);
    }
    this.gameReadyService.ready$
      .pipe(
        filter((isReady) => isReady),
        first(),
      )
      .subscribe(() => {
        this.gameReady.set(true);
      });
  }

  private async initializeGame(gameId: string): Promise<void> {
    await this.gameService.initializeGame(gameId);
  }
}
