import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalCardComponent } from '../../../app/game/component/animal-card/animal-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { Faction } from '../../../app/engine/model/faction.model';
import { ElementEnum } from '../../../app/game/constant/element.constant';
import { ElementPiece } from '../../../app/game/model/element.model';
import { AnimalEnum } from '../../../app/game/constant/animal.constant';
import { ActionPawnPiece } from '../../../app/game/model/action-pawn.model';
import { of } from 'rxjs';
import { Animal } from '../../../app/game/model/animal.model';
import { AnimalProviderService } from '../../../app/game/service/animal-provider.service';
import { defaultPieceFactory } from '../../../app/engine/model/piece.model';
import { PlayerService } from '../../../app/engine/service/player.service';

// Mock components for testing
@Component({
  selector: 'app-action-pawn',
  template: '<div></div>',
})
class MockActionPawnComponent {
  @Input() actionPawn: ActionPawnPiece | undefined = undefined;
}

@Component({
  selector: 'app-element',
  template: '<div></div>',
})
class MockElementComponent {
  @Input() element: ElementPiece | undefined = undefined;
}

describe('AnimalCardComponent', () => {
  let component: AnimalCardComponent;
  let fixture: ComponentFixture<AnimalCardComponent>;
  let debugElement: DebugElement;
  let componentRef;
  let mockCurrentPlayerFaction: jasmine.SpyObj<Faction>;
  let mockOtherPlayerFaction: jasmine.SpyObj<Faction>;
  let mockReptile: jasmine.SpyObj<Animal>;
  let mockBird: jasmine.SpyObj<Animal>;
  let mockAnimalProviderService: jasmine.SpyObj<AnimalProviderService>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;

  beforeEach(async () => {
    mockCurrentPlayerFaction = jasmine.createSpyObj('Faction', [], {
      id: AnimalEnum.REPTILE,
      name: AnimalEnum.REPTILE,
      ownerId: 'currentPlayer',
    });

    mockOtherPlayerFaction = jasmine.createSpyObj('Faction', [], {
      id: AnimalEnum.BIRD,
      name: AnimalEnum.BIRD,
      ownerId: 'otherPlayer',
    });

    mockReptile = jasmine.createSpyObj('Animal', ['id'], {
      id: AnimalEnum.REPTILE,
      elements: {
        elements$: of([
          defaultPieceFactory(ElementEnum.SUN),
          defaultPieceFactory(ElementEnum.SUN),
        ] as ElementPiece[]),
      },
      actionPawn: {
        length$: of(7),
      },
      species: {
        length$: of(55),
      },
    });
    mockBird = jasmine.createSpyObj('Animal', ['id'], {
      id: AnimalEnum.BIRD,
      elements: {
        elements$: of([
          defaultPieceFactory(ElementEnum.SEED),
          defaultPieceFactory(ElementEnum.SEED),
        ] as ElementPiece[]),
      },
      actionPawn: {
        length$: of(7),
      },
      species: {
        length$: of(55),
      },
    });

    mockAnimalProviderService = jasmine.createSpyObj('AnimalProviderService', [], {
      animals$: of([mockReptile, mockBird]),
    });

    mockPlayerService = jasmine.createSpyObj('PlayerService', [], {
      currentPlayer: {
        id: 'currentPlayer',
      },
    });

    await TestBed.configureTestingModule({
      declarations: [MockActionPawnComponent, MockElementComponent],
      imports: [AnimalCardComponent, MatCardModule, MatGridListModule],
      providers: [
        { provide: AnimalProviderService, useValue: mockAnimalProviderService },
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compileComponents();
  });

  describe('Render Template for Current Player', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AnimalCardComponent);
      debugElement = fixture.debugElement;
      component = fixture.componentInstance;
      componentRef = fixture.componentRef;
      componentRef.setInput('faction', mockCurrentPlayerFaction);
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should display the faction name', () => {
      const factionName = debugElement.query(By.css('.animal-card-title span'))
        .nativeElement as HTMLElement;
      expect(factionName.textContent).toContain(AnimalEnum.REPTILE);
    });
    it('should bold faction name', () => {
      const factionName = debugElement.query(By.css('.animal-card-title span'));
      expect(factionName.classes['current-player-animal']).toBeTrue();
    });
    it('should display the correct number of action pawns', () => {
      const actionPawnCount = debugElement.query(By.css('.piece-counter-number'))
        .nativeElement as HTMLElement;
      expect(actionPawnCount.textContent).toBe('7');
    });
    it('should display the correct number of species', () => {
      const speciesCount = debugElement.queryAll(By.css('.piece-counter-number'))[1]
        .nativeElement as HTMLElement;
      expect(speciesCount.textContent).toBe('55');
    });
    it('should display the correct number of elements', () => {
      const elements = debugElement.queryAll(By.css('app-element'));
      expect(elements.length).toBe(2);
    });
    it('should pass the correct actionPawn to the app-action-pawn component', () => {
      const actionPawnDebugElement = debugElement.query(By.css('app-action-pawn'));
      const actionPawnComponent =
        actionPawnDebugElement.componentInstance as MockActionPawnComponent;
      expect(actionPawnComponent.actionPawn).toBe(component.actionPawnForHeader());
    });
    it('should pass the correct elements to the app-element components', () => {
      const elementComponents = debugElement.queryAll(By.css('app-element'));
      const firstElementComponent = elementComponents[0].componentInstance as MockElementComponent;
      const secondElementComponent = elementComponents[1].componentInstance as MockElementComponent;
      expect(firstElementComponent.element).toBeTruthy();
      expect(secondElementComponent.element).toBeTruthy();
      if (firstElementComponent.element && secondElementComponent.element) {
        expect(firstElementComponent.element.kind).toEqual(ElementEnum.SUN);
        expect(secondElementComponent.element.kind).toEqual(ElementEnum.SUN);
      }
    });
  });
  describe('Render Template for Other Player', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AnimalCardComponent);
      debugElement = fixture.debugElement;
      component = fixture.componentInstance;
      componentRef = fixture.componentRef;
      componentRef.setInput('faction', mockOtherPlayerFaction);
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should not bold faction name', () => {
      const factionName = debugElement.query(By.css('.animal-card-title span'));
      expect(factionName.classes['current-player-animal']).not.toBeTrue();
    });
  });
});
