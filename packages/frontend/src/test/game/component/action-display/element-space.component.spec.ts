import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ElementSpaceComponent } from '../../../../app/game/component/action-display/space/element-space/element-space.component';
import { ComponentRef, DebugElement } from '@angular/core';
import { ElementComponent } from '../../../../app/game/component/element/element.component';
import { ElementPiece } from '../../../../app/game/model/element.model';
import { ElementEnum } from '../../../../app/game/constant/element.constant';
import { By } from '@angular/platform-browser';
import { Space } from '../../../../app/engine/model/space.model';
import { of, Subject } from 'rxjs';

describe('ElementSpaceComponent', () => {
  let component: ElementSpaceComponent;
  let fixture: ComponentFixture<ElementSpaceComponent>;
  let componentRef: ComponentRef<ElementSpaceComponent>;
  let debugElement: DebugElement;
  let mockElement: jasmine.SpyObj<ElementPiece>;
  let mockElementSpaceSubject: Subject<Space>;
  let mockElementSpaceWithElement: jasmine.SpyObj<Space>;
  let mockElementSpaceWithoutElement: jasmine.SpyObj<Space>;
  let mockElementSpaceInput: jasmine.SpyObj<Space>;

  beforeEach(async () => {
    mockElement = jasmine.createSpyObj('ElementPiece', [], {
      kind: ElementEnum.SUN,
    });

    // See ElementSpaceComponent for details on how these three spaces are used.
    mockElementSpaceSubject = new Subject<Space>();
    mockElementSpaceInput = jasmine.createSpyObj('Space', [], {
      space$: mockElementSpaceSubject.asObservable(),
    });
    mockElementSpaceWithElement = jasmine.createSpyObj('Space', [], {
      space$: of(mockElementSpaceWithElement),
      piece: mockElement,
      actions: [],
    });
    mockElementSpaceWithoutElement = jasmine.createSpyObj('Space', [], {
      space$: of(mockElementSpaceWithoutElement),
      piece: null,
      actions: [],
    });

    await TestBed.configureTestingModule({
      imports: [ElementSpaceComponent, ElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ElementSpaceComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    debugElement = fixture.debugElement;
  });

  it('should display app-element if element is defined', fakeAsync(() => {
    componentRef.setInput('space', mockElementSpaceInput);
    fixture.detectChanges();
    mockElementSpaceSubject.next(mockElementSpaceWithElement);
    tick();
    fixture.detectChanges();
    const appElementDebug = debugElement.query(By.directive(ElementComponent));

    expect(appElementDebug).toBeTruthy();
    const appElementComponent = appElementDebug.componentInstance as ElementComponent;
    expect(appElementComponent.element).toEqual(component.element());
  }));

  it('should display the fallback image if element is undefined', fakeAsync(() => {
    componentRef.setInput('space', mockElementSpaceInput);
    fixture.detectChanges();
    mockElementSpaceSubject.next(mockElementSpaceWithoutElement);
    tick();
    fixture.detectChanges();

    const imgDebug = debugElement.query(By.css('img'));
    expect(imgDebug).toBeTruthy();
  }));
});
