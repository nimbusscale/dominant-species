import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeballComponent } from '../../../../app/game/component/action-display/eyeball/eyeball.component';

describe('EyeballComponent', () => {
  let component: EyeballComponent;
  let fixture: ComponentFixture<EyeballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeballComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EyeballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
