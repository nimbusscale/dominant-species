import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../service/game-management/player.service';
import {Player} from 'api-types/src/player';
import {GameService} from '../../service/game-management/game.service';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {filter, Subscription} from 'rxjs';
import {isNotUndefined} from '../../util/predicate';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatChip} from '@angular/material/chips';
import {MatTooltip} from '@angular/material/tooltip';
import {ensureDefined} from "../../util/misc";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatChip,
    MatTooltip
  ],
  templateUrl: './create-game-page.component.html',
  styleUrl: './create-game-page.component.scss',
})
export class CreateGamePageComponent implements OnInit {
  private readonly MAX_PLAYERS = 6;
  playerControls: FormArray<FormControl>;
  private subscriptions: Subscription[] = [];
  currentUser: Player | undefined;
  filteredPlayers: string[][] = [[], [], [], [], []];
  errorMessages: string[] = ['', '', '', '', ''];
  validPlayers: Set<string>[] = Array.from({length: 5}, () => new Set<string>());
  availableFriends: string[] = [];
  validInputStates: boolean[] = [false, false, false, false, false];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private playerService: PlayerService,
    private gameService: GameService
  ) {
    this.playerControls = this.fb.array(
      Array.from({length: this.MAX_PLAYERS - 1}, () => this.fb.control(''))
    ) as FormArray<FormControl>;
  }

  ngOnInit(): void {
    const playerSubscription = this.playerService.currentPlayer$
      .pipe(filter(isNotUndefined))
      .subscribe((player) => {
        this.currentUser = player;
        this.updateAvailableFriends();
      });
    this.subscriptions.push(playerSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private async fetchPlayers(index: number): Promise<void> {
    const control = this.playerControls.at(index);
    const input = control.value as string | null;
    this.validPlayers[index].clear();
    this.filteredPlayers[index] = [];

    if (input) {
      try {
        const players = await this.playerService.findPlayers(input);
        const selectedPlayers = new Set(
          this.playerControls.value
            .filter((player: string | null, i: number) => player && i !== index) as string[]
        );

        // Add the current user's username to the selected players
        selectedPlayers.add(ensureDefined(this.currentUser).username);

        this.filteredPlayers[index] = players.filter(player => !selectedPlayers.has(player));
        players.forEach(player => this.validPlayers[index].add(player));
      } catch (error) {
        console.error(error);
        this.errorMessages[index] = 'Error fetching players';
        control.setErrors({fetchError: true});
      }
    }
  }

  async onPlayerInput(index: number): Promise<void> {
    await this.fetchPlayers(index);
  }

  async onPlayerBlur(index: number): Promise<void> {
    const control = this.playerControls.at(index);
    const input = control.value as string | null;
    const selectedPlayers = new Set(
      this.playerControls.value
        .filter((player: string | null, i: number) => player && i !== index) as string[]
    );

    // Add the current user's username to the selected players
    selectedPlayers.add(ensureDefined(this.currentUser).username);

    this.errorMessages[index] = '';
    control.setErrors(null);

    if (input) {
      // Ensure the validPlayers set is populated
      if (!this.validPlayers[index].has(input)) {
        await this.fetchPlayers(index);
      }

      if (!this.validPlayers[index].has(input)) {
        this.errorMessages[index] = 'Invalid username';
        control.setErrors({invalid: true});
        this.validInputStates[index] = false;
      } else if (selectedPlayers.has(input)) {
        this.errorMessages[index] = 'Player already in the game';
        control.setErrors({duplicate: true});
        this.validInputStates[index] = false;
      } else {
        this.validInputStates[index] = !this.isFriend(input);
      }

      this.updateAvailableFriends();
    } else {
      // Clear validation states if input is empty
      this.validPlayers[index].clear();
      this.validInputStates[index] = false;
      this.filteredPlayers[index] = [];
    }
  }

  isGameFullOrInvalid(): boolean {
    return this.hasInvalidPlayer() || this.playerControls.controls.every(control => control.value);
  }

  async addFriendToGame(playerId: string): Promise<void> {
    const emptyControl = this.playerControls.controls.find(control => !control.value);
    if (!emptyControl) return;

    emptyControl.setValue(playerId);
    this.updateAvailableFriends();
    void await this.onPlayerInput(this.playerControls.controls.indexOf(emptyControl));
  }

  updateAvailableFriends(): void {
    const selectedPlayers = new Set(this.playerControls.value.filter(Boolean) as string[]);
    this.availableFriends = ensureDefined(this.currentUser).friends.filter(friend => !selectedPlayers.has(friend));
  }

  hasValidPlayers(): boolean {
    return this.playerControls.controls.some(control => control.value && !control.invalid);
  }

  hasInvalidPlayer(): boolean {
    return this.playerControls.controls.some(control => control.invalid);
  }

  async addFriend(playerId: string): Promise<void> {
    if (ensureDefined(this.currentUser).friends.includes(playerId)) return;
    try {
      await this.playerService.addFriend(playerId);
    } catch (error) {
      this.snackBar.open('Failed to add friend', 'Close', {
        duration: 3000,
      });
      console.error('Failed to add friend', error);
    }
  }


  isFriend(playerId: string): boolean {
    return ensureDefined(this.currentUser).friends.includes(playerId);
  }

  async createGame(): Promise<void> {
    const otherPlayers = this.playerControls.value
      .filter((player: string | null): player is string => !!player);
    try {
      await this.gameService.createGame(otherPlayers);
      void this.router.navigate(['/lobby']);
    } catch (error) {
      this.snackBar.open('Error creating game', 'Close', {
        duration: 3000,
      });
      console.error(error);
    }
  }
}
