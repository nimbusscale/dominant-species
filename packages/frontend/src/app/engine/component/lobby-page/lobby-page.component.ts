import { Component, signal } from '@angular/core';
import { Game } from 'api-types/src/game';
import { GameService } from '../../service/game-management/game.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { PlayerService } from '../../service/game-management/player.service';
import { Player } from 'api-types/src/player';
import { MatTooltip } from '@angular/material/tooltip';
import { NavigateService } from '../../service/navigate.service';

@Component({
  selector: 'app-lobby-page',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatButton,
    MatIcon,
    MatMiniFabButton,
    MatChipSet,
    MatChip,
    MatTooltip,
  ],
  templateUrl: './lobby-page.component.html',
  styleUrl: './lobby-page.component.scss',
})
export class LobbyPageComponent {
  games = signal<Game[]>([]);
  gameTableColumns: string[] = ['gameId', 'host', 'playerIds', 'actions'];
  readonly currentPlayer = signal<Player | undefined>(undefined);

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private navigate: NavigateService,
  ) {
    this.playerService.currentPlayer$.subscribe((player) => {
      this.currentPlayer.set(player);
      void this.fetchGames();
    });
  }

  filterPlayers(game: Game): string[] {
    return game.playerIds
      .filter((player) => player !== game.host)
      .slice()
      .sort();
  }

  async fetchGames(): Promise<void> {
    this.games.set(await this.gameService.getGamesForLoggedInPlayer());
  }

  async createGame(): Promise<void> {
    await this.navigate.toCreateGamePage();
  }

  async completeGame(gameId: string): Promise<void> {
    await this.gameService.completeGame(gameId);
    await this.fetchGames();
  }

  async joinGame(gameId: string): Promise<void> {
    await this.gameService.joinGame(gameId);
  }
}
