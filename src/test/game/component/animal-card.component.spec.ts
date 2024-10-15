import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AnimalCardComponent} from "../../../app/game/component/animal-card/animal-card.component";
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { By } from '@angular/platform-browser';
import {Component, DebugElement, Input} from '@angular/core';
import {Faction, FactionState} from "../../../app/engine/model/faction.model";
import {deepClone} from "fast-json-patch";
import {testFactionState1} from "../../engine/game-state-test.constant";
import {Pile} from "../../../app/engine/model/pile.model";
import {PieceKindEnum} from "../../../app/game/constant/piece.constant";
import {defaultPieceFactory} from "../../../app/engine/model/piece.model";
import {ElementEnum} from "../../../app/game/constant/element.constant";
import {ElementPiece} from "../../../app/game/model/element.model";
import {AnimalEnum} from "../../../app/game/constant/animal.constant";
import {AreaIdEnum} from "../../../app/game/constant/area.constant";
import {PileIdEnum} from "../../../app/game/constant/pile.constant";
import {ActionPawnPiece} from "../../../app/game/model/action-pawn.model";


// Mock components for testing
@Component({
  selector: 'app-action-pawn',
  template: '<div></div>'
})
class MockActionPawnComponent {
  @Input() actionPawn: ActionPawnPiece | undefined = undefined;
}

@Component({
  selector: 'app-element',
  template: '<div></div>'
})
class MockElementComponent {
  @Input() element: ElementPiece | undefined = undefined;
}

describe('AnimalCardComponent', () => {
  let component: AnimalCardComponent;
  let fixture: ComponentFixture<AnimalCardComponent>;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockActionPawnComponent,
        MockElementComponent
      ],
      imports: [
        AnimalCardComponent,
        MatCardModule,
        MatGridListModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalCardComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    component.actionPawnForHeader = defaultPieceFactory(PieceKindEnum.ACTION_PAWN, AnimalEnum.REPTILE) as ActionPawnPiece;
    component.faction = new Faction({
      id: AnimalEnum.REPTILE,
      name: AnimalEnum.REPTILE,
      ownerId: 'tester1',
      score: 0,
      }
    )
    component.actionPawnPile = new Pile({
      id: PileIdEnum.ACTION_PAWN_REPTILE,
      owner: component.faction.ownerId,
      inventory: {
        [PieceKindEnum.ACTION_PAWN]: 7
      }
    })
    component.speciesPile = new Pile({
      id: PileIdEnum.SPECIES_REPTILE,
      owner: component.faction.ownerId,
      inventory: {
        [PieceKindEnum.SPECIES]: 55
      }
    })
    component.elements = [
      defaultPieceFactory(ElementEnum.SUN) as ElementPiece,
      defaultPieceFactory(ElementEnum.SUN) as ElementPiece,
      ];
    component.emptyElementSpaces = [null, null];
    fixture.detectChanges();
  });

  describe('Render Template', () => {
    it('should display the faction name', () => {
      const factionName = element.query(By.css('.animal-card-title span')).nativeElement;
      expect(factionName.textContent).toContain(AnimalEnum.REPTILE);
    });
    it('should display the correct number of action pawns', () => {
      const actionPawnCount = element.query(By.css('.piece-counter-number')).nativeElement;
      expect(actionPawnCount.textContent).toBe('7');
    });
    it('should display the correct number of species', () => {
      const speciesCount = element.queryAll(By.css('.piece-counter-number'))[1].nativeElement;
      expect(speciesCount.textContent).toBe('55');
    });
    it('should display the correct number of elements', () => {
      const elements = element.queryAll(By.css('app-element'));
      expect(elements.length).toBe(2);
    });
    it('should pass the correct actionPawn to the app-action-pawn component', () => {
      const actionPawnDebugElement = element.query(By.css('app-action-pawn'));
      const actionPawnComponent = actionPawnDebugElement.componentInstance;
      expect(actionPawnComponent.actionPawn).toBe(component.actionPawnForHeader);
    });
    it('should pass the correct elements to the app-element components', () => {
      const elementComponents = element.queryAll(By.css('app-element'));
      expect(elementComponents[0].componentInstance.element.kind).toEqual(ElementEnum.SUN);
      expect(elementComponents[1].componentInstance.element.kind).toEqual(ElementEnum.SUN);
    });
  })
});
