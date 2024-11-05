/* eslint-disable */
// ChatGPT wrote this component and tests and I don't want to deal with cleaning things up for the linter right now.
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Player } from 'api-types/src/player';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerService } from '../../../app/engine/service/game-management/player.service';
import { CreateGamePageComponent } from '../../../app/engine/component/create-game-page/create-game-page.component';
import { GameService } from '../../../app/engine/service/game-management/game.service';

describe('CreateGamePageComponent', () => {
  let component: CreateGamePageComponent;
  let fixture: ComponentFixture<CreateGamePageComponent>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const currentPlayer: Player = {
    username: 'currentUser',
    friends: ['friend1', 'friend2'],
  };

  beforeEach(waitForAsync(() => {
    mockPlayerService = jasmine.createSpyObj('PlayerService', [
      'currentPlayer$',
      'findPlayers',
      'addFriend',
    ]);
    mockGameService = jasmine.createSpyObj('GameService', ['createGame']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Mock the currentPlayer$ observable
    mockPlayerService.currentPlayer$ = of(currentPlayer);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule, // To avoid animation issues in tests
      ],
      providers: [
        { provide: PlayerService, useValue: mockPlayerService },
        { provide: GameService, useValue: mockGameService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component and initialize correctly', () => {
    expect(component).toBeTruthy();
    expect(component.currentUser).toEqual(currentPlayer);
    expect(component.availableFriends).toEqual(['friend1', 'friend2']);
  });

  it('should fetch players on input', fakeAsync(() => {
    const index = 0;
    const control = component.playerControls.at(index);
    control.setValue('player');
    const mockPlayers = ['player1', 'player2'];
    mockPlayerService.findPlayers.and.returnValue(Promise.resolve(mockPlayers));

    component.onPlayerInput(index);
    tick(); // Simulate asynchronous passage of time

    expect(mockPlayerService.findPlayers).toHaveBeenCalledWith('player');
    expect(component.filteredPlayers[index]).toEqual(mockPlayers);
    expect(component.validPlayers[index]).toEqual(new Set(mockPlayers));
  }));

  it('should handle errors when fetching players', fakeAsync(() => {
    const index = 0;
    const control = component.playerControls.at(index);
    control.setValue('player');
    mockPlayerService.findPlayers.and.returnValue(Promise.reject('Error'));

    component.onPlayerInput(index);
    tick();

    expect(component.errorMessages[index]).toBe('Error fetching players');
    expect(control.hasError('fetchError')).toBeTrue();
  }));

  it('should validate input on blur - invalid username', fakeAsync(() => {
    const index = 0;
    const control = component.playerControls.at(index);
    control.setValue('invalidUser');
    mockPlayerService.findPlayers.and.returnValue(Promise.resolve([]));

    component.onPlayerBlur(index);
    tick();

    expect(component.errorMessages[index]).toBe('Invalid username');
    expect(control.hasError('invalid')).toBeTrue();
  }));

  it('should validate input on blur - duplicate username', fakeAsync(() => {
    const index = 0;
    const control = component.playerControls.at(index);
    control.setValue('player1');
    mockPlayerService.findPlayers.and.returnValue(Promise.resolve(['player1']));
    component.playerControls.at(1).setValue('player1'); // Simulate duplicate

    component.onPlayerBlur(index);
    tick();

    expect(component.errorMessages[index]).toBe('Player already in the game');
    expect(control.hasError('duplicate')).toBeTrue();
  }));

  it('should add friend to the game', fakeAsync(() => {
    component.addFriendToGame('friend1');
    tick();

    expect(component.playerControls.at(0).value).toBe('friend1');
    expect(component.availableFriends).toEqual(['friend2']);
  }));

  it('should not add friend if game is full', () => {
    // Fill all player controls
    component.playerControls.controls.forEach((control: FormControl, index: number) => {
      control.setValue(`player${index}`);
    });

    component.addFriendToGame('friend1');
    expect(
      component.playerControls.controls.some((control: FormControl) => control.value === 'friend1'),
    ).toBeFalse();
  });

  it('should create game with valid players', fakeAsync(() => {
    component.playerControls.at(0).setValue('player1');
    component.playerControls.at(1).setValue('player2');
    mockGameService.createGame.and.returnValue(Promise.resolve());
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    component.createGame();
    tick();

    expect(mockGameService.createGame).toHaveBeenCalledWith(['player1', 'player2']);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lobby']);
  }));

  it('should handle error when creating game', fakeAsync(() => {
    component.playerControls.at(0).setValue('player1');
    mockGameService.createGame.and.returnValue(Promise.reject('Error'));

    component.createGame();
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Error creating game', 'Close', {
      duration: 3000,
    });
  }));

  it('should add a friend', fakeAsync(() => {
    mockPlayerService.addFriend.and.returnValue(Promise.resolve());

    component.addFriend('newFriend');
    tick();

    expect(mockPlayerService.addFriend).toHaveBeenCalledWith('newFriend');
  }));

  it('should handle error when adding a friend', fakeAsync(() => {
    mockPlayerService.addFriend.and.returnValue(Promise.reject('Error'));

    component.addFriend('newFriend');
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to add friend', 'Close', {
      duration: 3000,
    });
  }));

  it('should disable "Create Game" button when invalid', () => {
    const button = fixture.debugElement.query(By.css('button[color="primary"]')).nativeElement;
    component.playerControls.at(0).setValue('');
    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('should enable "Create Game" button when valid players are added', () => {
    const button = fixture.debugElement.query(By.css('button[color="primary"]')).nativeElement;
    component.playerControls.at(0).setValue('player1');
    component.playerControls.at(1).setValue('player2');
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });

  it('should not suggest the current user in autocomplete', fakeAsync(() => {
    const index = 0;
    const control = component.playerControls.at(index);
    control.setValue('curr'); // Partial match with 'currentUser'
    const mockPlayers = ['currentUser', 'user1'];
    mockPlayerService.findPlayers.and.returnValue(Promise.resolve(mockPlayers));

    component.onPlayerInput(index);
    tick();

    expect(component.filteredPlayers[index]).toEqual(['user1']);
  }));

  it('should update available friends when players are added', () => {
    component.playerControls.at(0).setValue('friend1');
    component.updateAvailableFriends();

    expect(component.availableFriends).toEqual(['friend2']);
  });

  it('should prevent adding duplicate friends', () => {
    component.playerControls.at(0).setValue('friend1');
    component.addFriendToGame('friend1');

    expect(
      component.playerControls.controls.filter(
        (control: FormControl) => control.value === 'friend1',
      ).length,
    ).toBe(1);
  });

  it('should handle empty input on blur', fakeAsync(() => {
    const index = 0;
    const control = component.playerControls.at(index);
    control.setValue('');

    component.onPlayerBlur(index);
    tick();

    expect(control.errors).toBeNull();
    expect(component.errorMessages[index]).toBe('');
    expect(component.validInputStates[index]).toBeFalse();
  }));
});
