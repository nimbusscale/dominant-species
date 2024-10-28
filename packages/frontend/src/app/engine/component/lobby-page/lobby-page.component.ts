import {Component, signal} from '@angular/core';
import {Game} from "api-types/src/game";
import {GameService} from "../../service/game-management/game.service";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatChip, MatChipSet} from "@angular/material/chips";

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
    MatChip
  ],
  templateUrl: './lobby-page.component.html',
  styleUrl: './lobby-page.component.scss'
})
export class LobbyPageComponent {
  games = signal<Game[]>([])
  gameTableColumns: string[] = ['gameId', 'host', 'players', 'actions'];

  constructor(
    private gameService: GameService,
  ) {
    void this.fetchGames()
  }

  filterPlayers(game: Game): string[] {
    return game.players.filter(player => player !== game.host).slice().sort();
  }

  async fetchGames(): Promise<void> {
    this.games.set(await this.gameService.getGamesForLoggedInPlayer())
  }

  async createGame(): Promise<void> {
    await this.gameService.createGame(['tester1', 'tester2', 'tester3'])
    await this.fetchGames()
  }

  async completeGame(gameId: string): Promise<void> {
    await this.gameService.completeGame(gameId)
    await this.fetchGames()
  }

}
