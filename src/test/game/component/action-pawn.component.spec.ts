import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPawnComponent } from '../../../app/game/component/action-pawn/action-pawn.component';

describe('ActionPawnComponent', () => {
  let component: ActionPawnComponent;
  let fixture: ComponentFixture<ActionPawnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPawnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPawnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
