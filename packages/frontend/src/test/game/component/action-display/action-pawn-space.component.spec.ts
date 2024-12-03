import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ActionPawnSpaceComponent } from '../../../../app/game/component/action-display/space/action-pawn-space/action-pawn-space.component';
import { ComponentRef, DebugElement } from '@angular/core';
import { ActionPawnPiece } from '../../../../app/game/model/action-pawn.model';
import { EyeballComponent } from '../../../../app/game/component/action-display/space/eyeball/eyeball.component';
import { ActionPawnComponent } from '../../../../app/game/component/action-pawn/action-pawn.component';
import { AnimalEnum } from '../../../../app/game/constant/animal.constant';
import { By } from '@angular/platform-browser';
import { Space } from '../../../../app/engine/model/space.model';
import { Subject } from 'rxjs';

describe('ActionPawnSpaceComponent', () => {
  let fixture: ComponentFixture<ActionPawnSpaceComponent>;
  let componentRef: ComponentRef<ActionPawnSpaceComponent>;
  let debugElement: DebugElement;
  let mockActionPawn: jasmine.SpyObj<ActionPawnPiece>;
  let mockActionPawnSpaceSubject: Subject<Space>;
  let mockActionPawnSpaceWithActionPawn: jasmine.SpyObj<Space>;
  let mockActionPawnSpaceWithoutActionPawn: jasmine.SpyObj<Space>;
  let mockActionPawnSpaceInput: jasmine.SpyObj<Space>;

  beforeEach(async () => {
    mockActionPawn = jasmine.createSpyObj('ActionPawnPiece', [], {
      owner: AnimalEnum.REPTILE,
    });

    /**
     * mockActionPawnSpaceInput is used for the input signal and includes the space$ observable. Then different Space mocks can be injected
     * into the component by using the mockActionPawnSpaceSubject. Note that since the component subscribes to the space$ and sets some signals,
     * the tests need to wait for the subscriber function to run using tock and then do a detectChanges after the signal has been updated.
     */
    mockActionPawnSpaceSubject = new Subject<Space>();
    mockActionPawnSpaceInput = jasmine.createSpyObj('Space', [], {
      space$: mockActionPawnSpaceSubject.asObservable(),
    });
    mockActionPawnSpaceWithActionPawn = jasmine.createSpyObj('Space', [], {
      piece: mockActionPawn,
      actions: [],
    });
    mockActionPawnSpaceWithoutActionPawn = jasmine.createSpyObj('Space', [], {
      piece: null,
      actions: [],
    });

    await TestBed.configureTestingModule({
      imports: [ActionPawnSpaceComponent, EyeballComponent, ActionPawnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPawnSpaceComponent);
    componentRef = fixture.componentRef;
    debugElement = fixture.debugElement;
  });

  it('should display app-action-pawn if actionPawn is defined', fakeAsync(() => {
    componentRef.setInput('space', mockActionPawnSpaceInput);
    fixture.detectChanges();
    mockActionPawnSpaceSubject.next(mockActionPawnSpaceWithActionPawn);
    tick();
    fixture.detectChanges();

    const appActionPawnDebug = debugElement.query(By.directive(ActionPawnComponent));
    expect(appActionPawnDebug).toBeTruthy();
  }));
  it('should display app-eyeball if actionPawn is not defined', fakeAsync(() => {
    componentRef.setInput('space', mockActionPawnSpaceInput);
    fixture.detectChanges();
    mockActionPawnSpaceSubject.next(mockActionPawnSpaceWithoutActionPawn);
    tick();
    fixture.detectChanges();

    const appActionPawnDebug = debugElement.query(By.directive(EyeballComponent));
    expect(appActionPawnDebug).toBeTruthy();
  }));
});
