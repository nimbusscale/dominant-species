import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSpaceComponent } from '../../../../app/game/component/action-display/element-space/element-space.component';
import { DebugElement } from '@angular/core';
import { ElementComponent } from '../../../../app/game/component/element/element.component';
import { ElementPiece } from '../../../../app/game/model/element.model';
import { ElementEnum } from '../../../../app/game/constant/element.constant';
import { By } from '@angular/platform-browser';

describe('ElementSpaceComponent', () => {
  let component: ElementSpaceComponent;
  let fixture: ComponentFixture<ElementSpaceComponent>;
  let debugElement: DebugElement;
  let mockElement1: jasmine.SpyObj<ElementPiece>;

  beforeEach(async () => {
    mockElement1 = jasmine.createSpyObj('ElementPiece', [], {
      kind: ElementEnum.SUN,
    });

    await TestBed.configureTestingModule({
      imports: [ElementSpaceComponent, ElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ElementSpaceComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should display app-element if element is defined', () => {
    component.element = mockElement1;
    fixture.detectChanges();

    const appElementDebug = debugElement.query(By.directive(ElementComponent));

    expect(appElementDebug).toBeTruthy();
    const appElementComponent = appElementDebug.componentInstance as ElementComponent;
    expect(appElementComponent.element).toEqual(component.element);
  });

  it('should display the fallback image if element is undefined', () => {
    component.element = null;
    fixture.detectChanges(); // Trigger change detection

    const imgDebug = debugElement.query(By.css('img'));
    expect(imgDebug).toBeTruthy();
  });
});
