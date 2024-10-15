import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPawnSpaceComponent } from '../../../../app/game/component/action-display/action-pawn-space/action-pawn-space.component';
import {DebugElement} from "@angular/core";
import {ActionPawnPiece} from "../../../../app/game/model/action-pawn.model";
import {EyeballComponent} from "../../../../app/game/component/action-display/eyeball/eyeball.component";
import {ActionPawnComponent} from "../../../../app/game/component/action-pawn/action-pawn.component";
import {AnimalEnum} from "../../../../app/game/constant/animal.constant";
import {By} from "@angular/platform-browser";

describe('ActionPawnSpaceComponent', () => {
  let component: ActionPawnSpaceComponent;
  let fixture: ComponentFixture<ActionPawnSpaceComponent>;
  let debugElement: DebugElement;
  let mockActionPawn: jasmine.SpyObj<ActionPawnPiece>;

  beforeEach(async () => {
    mockActionPawn = jasmine.createSpyObj('ActionPawnPiece', [], {
      owner: AnimalEnum.REPTILE
    })

    await TestBed.configureTestingModule({
      imports: [ActionPawnSpaceComponent, EyeballComponent, ActionPawnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPawnSpaceComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should display app-action-pawn if actionPawn is defined', () => {
    component.actionPawn = mockActionPawn;
    fixture.detectChanges();

    const appActionPawnDebug = debugElement.query(By.directive(ActionPawnComponent));
    expect(appActionPawnDebug).toBeTruthy();
  });
  it('should display app-eyeball if actionPawn is not defined', () => {
    component.actionPawn = null
    fixture.detectChanges();

    const appActionPawnDebug = debugElement.query(By.directive(EyeballComponent));
    expect(appActionPawnDebug).toBeTruthy();
  });
});
