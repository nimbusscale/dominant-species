import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDisplayComponent } from '../../../../app/game/component/action-display/action-display.component';

describe('ActionDisplayComponent', () => {
  let component: ActionDisplayComponent;
  let fixture: ComponentFixture<ActionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
