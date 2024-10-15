import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalCardComponent } from '../../../app/game/component/animal-card/animal-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { Faction } from '../../../app/engine/model/faction.model';
import { Pile } from '../../../app/engine/model/pile.model';
import { ElementEnum } from '../../../app/game/constant/element.constant';
import { ElementPiece } from '../../../app/game/model/element.model';
import { AnimalEnum } from '../../../app/game/constant/animal.constant';
import { AreaIdEnum } from '../../../app/game/constant/area.constant';
import { PileIdEnum } from '../../../app/game/constant/pile.constant';
import { ActionPawnPiece } from '../../../app/game/model/action-pawn.model';
import { AreaRegistryService } from '../../../app/engine/service/game-element/area-registry.service';
import { PileRegistryService } from '../../../app/engine/service/game-element/pile-registry.service';
import { Subject } from 'rxjs';
import { Area } from '../../../app/engine/model/area.model';

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
  let mockFaction: jasmine.SpyObj<Faction>;
  let mockElementArea: jasmine.SpyObj<Area>;
  let mockElement1: jasmine.SpyObj<ElementPiece>;
  let mockElement2: jasmine.SpyObj<ElementPiece>;
  let mockAreaRegistryService: jasmine.SpyObj<AreaRegistryService>;
  let mockActionPawnPile: jasmine.SpyObj<Pile>;
  let mockSpeciesPile: jasmine.SpyObj<Pile>;
  let mockPileRegistryService: jasmine.SpyObj<PileRegistryService>;

  beforeEach(async () => {
    mockFaction = jasmine.createSpyObj('Faction', [], {
      id: AnimalEnum.REPTILE,
      name: AnimalEnum.REPTILE,
    });

    mockElement1 = jasmine.createSpyObj('ElementPiece', [], {
      kind: ElementEnum.SUN,
    });
    mockElement2 = jasmine.createSpyObj('ElementPiece', [], {
      kind: ElementEnum.SUN,
    });

    mockElementArea = jasmine.createSpyObj('Area', [], {
      id: PileIdEnum.ACTION_PAWN_REPTILE,
      spaces: [
        { piece: mockElement1 },
        { piece: mockElement2 },
        { piece: null },
        { piece: null },
        { piece: null },
        { piece: null },
      ],
    });
    mockAreaRegistryService = jasmine.createSpyObj('AreaRegistryService', ['get'], {
      registeredIds$: new Subject<Set<string>>(),
    });
    mockActionPawnPile = jasmine.createSpyObj('Pile', [], {
      id: PileIdEnum.ACTION_PAWN_REPTILE,
      length: 7,
    });
    mockSpeciesPile = jasmine.createSpyObj('Pile', [], {
      id: PileIdEnum.SPECIES_REPTILE,
      length: 55,
    });
    mockPileRegistryService = jasmine.createSpyObj('PileRegistryService', ['get'], {
      registeredIds$: new Subject<Set<string>>(),
    });

    await TestBed.configureTestingModule({
      declarations: [MockActionPawnComponent, MockElementComponent],
      imports: [AnimalCardComponent, MatCardModule, MatGridListModule],
      providers: [
        { provide: AreaRegistryService, useValue: mockAreaRegistryService },
        { provide: PileRegistryService, useValue: mockPileRegistryService },
      ],
    }).compileComponents();
  });

  describe('ngOnInit', () => {
    let mockAreaRegistryServiceRegisteredIds$: Subject<Set<string>>;
    let mockPileRegistryServiceRegisteredIds$: Subject<Set<string>>;

    beforeEach(() => {
      fixture = TestBed.createComponent(AnimalCardComponent);
      component = fixture.componentInstance;
      component.faction = mockFaction;
      mockAreaRegistryServiceRegisteredIds$ = mockAreaRegistryService.registeredIds$ as Subject<
        Set<string>
      >;
      mockPileRegistryServiceRegisteredIds$ = mockPileRegistryService.registeredIds$ as Subject<
        Set<string>
      >;

      component.ngOnInit();
    });
    it('should set actionPawnForHeader', () => {
      expect(component.actionPawnForHeader).toBeTruthy();
      if (component.actionPawnForHeader) {
        expect(component.actionPawnForHeader.owner).toEqual(AnimalEnum.REPTILE);
      }
    });
    it('should subscribe to areaRegistryService and set elements', () => {
      mockAreaRegistryService.get.and.returnValue(mockElementArea);
      mockAreaRegistryServiceRegisteredIds$.next(new Set([AreaIdEnum.REPTILE_ELEMENT]));

      expect(component.elements).toEqual([mockElement1, mockElement2]);
      expect(component.emptyElementSpaces.length).toBe(4);
    });
    it('should subscribe to pileRegistryService and set actionPawnPile', () => {
      mockPileRegistryService.get.and.returnValue(mockActionPawnPile);
      mockPileRegistryServiceRegisteredIds$.next(new Set([PileIdEnum.ACTION_PAWN_REPTILE]));

      expect(component.actionPawnPile).toEqual(mockActionPawnPile);
    });
    it('should subscribe to pileRegistryService and set speciesPile', () => {
      mockPileRegistryService.get.and.returnValue(mockSpeciesPile);
      mockPileRegistryServiceRegisteredIds$.next(new Set([PileIdEnum.SPECIES_REPTILE]));

      expect(component.speciesPile).toEqual(mockSpeciesPile);
    });
  });

  describe('Render Template', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AnimalCardComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      component.actionPawnForHeader = jasmine.createSpyObj('ActionPawnPiece', ['kind']);
      component.faction = mockFaction;
      component.actionPawnPile = mockActionPawnPile;
      component.speciesPile = mockSpeciesPile;
      component.elements = [mockElement1, mockElement2];
      component.emptyElementSpaces = [null, null];
      fixture.detectChanges();
    });
    it('should display the faction name', () => {
      const factionName = debugElement.query(By.css('.animal-card-title span'))
        .nativeElement as HTMLElement;
      expect(factionName.textContent).toContain(AnimalEnum.REPTILE);
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
      expect(actionPawnComponent.actionPawn).toBe(component.actionPawnForHeader);
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
});
