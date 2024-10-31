import {Component, OnInit} from '@angular/core';
import {PlayerService} from "../../service/game-management/player.service";
import { Player } from 'api-types/src/player';
import {GameService} from "../../service/game-management/game.service";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {filter, take} from "rxjs";
import {isNotUndefined} from "../../util/predicate";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-game-page',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatButton,
    MatInput,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-game-page.component.html',
  styleUrl: './create-game-page.component.scss',
})
export class CreateGamePageComponent implements OnInit {
  currentUser: Player | undefined;
  form: FormGroup;
  filteredPlayers: string[][] = [[], [], [], [], []];
  errorMessages: string[] = ['', '', '', '', ''];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private playerService: PlayerService,
    private gameService: GameService
  ) {
    this.form = this.fb.group({
      players: this.fb.array(['', '', '', '', ''])
    });
  }

  ngOnInit(): void {
    this.playerService.currentPlayer$.pipe(filter(isNotUndefined)).subscribe((player) => {
      this.currentUser = player;
    })
  }

  get playerControls(): FormArray<FormControl> {
    return this.form.get('players') as FormArray<FormControl>;
  }

  async onPlayerInput(index: number): Promise<void> {
    const input = this.playerControls.at(index).value as string;

    const selectedPlayers = new Set(
      this.playerControls.value
        .filter((player: string | null, i: number) => player && i !== index) as string[]
    );

    this.filteredPlayers[index] = [];

    if (input) {
      try {
        const players = await this.playerService.findPlayers(input);
        this.filteredPlayers[index] = players.filter(player => !selectedPlayers.has(player));
        this.errorMessages[index] = '';
      } catch (error) {
        this.errorMessages[index] = 'Error fetching players';
        console.error(error)
      }
    }
  }

  async createGame(): Promise<void> {
    const otherPlayers = this.playerControls.value
      .filter((player: string | null): player is string => !!player);
    try {
      await this.gameService.createGame(otherPlayers);
      void this.router.navigate(['/lobby']);
    } catch (error) {
      alert('Error creating game');
      console.error(error);
    }
  }
}
