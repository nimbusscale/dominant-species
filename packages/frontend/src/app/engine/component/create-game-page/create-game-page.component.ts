import {Component, OnInit} from '@angular/core';
import {PlayerService} from "../../service/game-management/player.service";
import {Player} from 'api-types/src/player';
import {GameService} from "../../service/game-management/game.service";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {filter} from "rxjs";
import {isNotUndefined} from "../../util/predicate";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatChip} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";

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
  currentUser: Player | undefined;
  form: FormGroup;
  filteredPlayers: string[][] = [[], [], [], [], []];
  errorMessages: string[] = ['', '', '', '', ''];
  validPlayers: Set<string>[] = Array.from({length: 5}, () => new Set<string>());
  availableFriends: string[] = [];
  validInputStates: boolean[] = [false, false, false, false, false];


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
    this.playerService.currentPlayer$
      .pipe(filter(isNotUndefined))
      .subscribe((player) => {
        this.currentUser = player;
        this.updateAvailableFriends();
      });
  }

  get playerControls(): FormArray<FormControl> {
    return this.form.get('players') as FormArray<FormControl>;
  }

  async onPlayerInput(index: number, triggerValidation = false): Promise<void> {
    const control = this.playerControls.at(index);
    const input = control.value as string;
    this.validPlayers[index].clear();
    this.validInputStates[index] = false;

    const selectedPlayers = new Set(
      this.playerControls.value
        .filter((player: string | null, i: number) => player && i !== index) as string[]
    );

    this.filteredPlayers[index] = [];
    this.errorMessages[index] = '';
    control.setErrors(null);

    if (input) {
      try {
        const players = await this.playerService.findPlayers(input);
        this.filteredPlayers[index] = players.filter(player => !selectedPlayers.has(player));
        players.forEach(player => this.validPlayers[index].add(player));

        if (triggerValidation) {
          if (!this.validPlayers[index].has(input)) {
            this.errorMessages[index] = 'Invalid username';
            control.setErrors({invalid: true});
          } else if (selectedPlayers.has(input)) {
            this.errorMessages[index] = 'Player already in the game';
            control.setErrors({duplicate: true});
          } else {
            this.validInputStates[index] = !this.isFriend(input);  // Button only appears if not a friend
          }
          this.updateAvailableFriends();
        }
      } catch (error) {
        this.errorMessages[index] = 'Error fetching players';
        console.error(error);
        control.setErrors({fetchError: true});
      }
    }
  }


  isGameFullOrInvalid(): boolean {
    return this.hasInvalidPlayer() || this.playerControls.controls.every(control => control.value);
  }


  addFriendToGame(playerId: string): void {
    const emptyControl = this.playerControls.controls.find(control => !control.value);
    if (!emptyControl) return;

    emptyControl.setValue(playerId);
    this.updateAvailableFriends();
    void this.onPlayerInput(this.playerControls.controls.indexOf(emptyControl));
  }

  updateAvailableFriends(): void {
    const selectedPlayers = new Set(this.playerControls.value.filter(Boolean) as string[]);
    this.availableFriends = this.currentUser?.friends.filter(friend => !selectedPlayers.has(friend)) ?? [];
  }

  hasInvalidPlayer(): boolean {
    return this.playerControls.controls.some(control => control.invalid);
  }

  async addFriend(playerId: string): Promise<void> {
    if (!this.currentUser || this.currentUser.friends.includes(playerId)) return;
    try {
      await this.playerService.addFriend(playerId);
    } catch (error) {
      console.error('Failed to add friend', error);
    }
  }

  isFriend(playerId: string): boolean {
    return this.currentUser?.friends.includes(playerId) ?? false;
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
