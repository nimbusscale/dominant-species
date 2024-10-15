import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSpaceComponent } from '../../../../app/game/component/action-display/element-space/element-space.component';

describe('ElementSpaceComponent', () => {
  let component: ElementSpaceComponent;
  let fixture: ComponentFixture<ElementSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
