import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPawnSpaceComponent } from '../../../../app/game/component/action-display/space/action-pawn-space/action-pawn-space.component';
import {ComponentRef, DebugElement} from '@angular/core';
import { ActionPawnPiece } from '../../../../app/game/model/action-pawn.model';
import { EyeballComponent } from '../../../../app/game/component/action-display/space/eyeball/eyeball.component';
import { ActionPawnComponent } from '../../../../app/game/component/action-pawn/action-pawn.component';
import { AnimalEnum } from '../../../../app/game/constant/animal.constant';
import { By } from '@angular/platform-browser';
import {Space} from "../../../../app/engine/model/space.model";
import {of} from "rxjs";

describe('ActionPawnSpaceComponent', () => {
  let component: ActionPawnSpaceComponent;
  let fixture: ComponentFixture<ActionPawnSpaceComponent>;
  let componentRef: ComponentRef<ActionPawnSpaceComponent>
  let debugElement: DebugElement;
  let mockActionPawn: jasmine.SpyObj<ActionPawnPiece>;
  let mockActionPawnSpaceWithActionPawn: jasmine.SpyObj<Space>;
  let mockActionPawnSpaceWithoutActionPawn: jasmine.SpyObj<Space>;

  beforeEach(async () => {
    mockActionPawn = jasmine.createSpyObj('ActionPawnPiece', [], {
      owner: AnimalEnum.REPTILE,
    });
    mockActionPawnSpaceWithActionPawn = jasmine.createSpyObj('Space', [], {
      space$: of(mockActionPawnSpaceWithActionPawn),
      piece: mockActionPawn
    })
    mockActionPawnSpaceWithoutActionPawn = jasmine.createSpyObj('Space', [], {
      space$: of(mockActionPawnSpaceWithoutActionPawn),
      piece: null
    })


    await TestBed.configureTestingModule({
      imports: [ActionPawnSpaceComponent, EyeballComponent, ActionPawnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPawnSpaceComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef
    debugElement = fixture.debugElement;
  });

  it('should display app-action-pawn if actionPawn is defined', () => {
    componentRef.setInput('space', mockActionPawnSpaceWithActionPawn)
    fixture.detectChanges();

    const appActionPawnDebug = debugElement.query(By.directive(ActionPawnComponent));
    expect(appActionPawnDebug).toBeTruthy();
  });
  it('should display app-eyeball if actionPawn is not defined', () => {
    componentRef.setInput('space', mockActionPawnSpaceWithoutActionPawn)
    fixture.detectChanges();

    const appActionPawnDebug = debugElement.query(By.directive(EyeballComponent));
    expect(appActionPawnDebug).toBeTruthy();
  });
});
