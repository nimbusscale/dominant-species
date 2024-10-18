import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpConfirmPageComponent } from '../../../app/engine/component/sign-up-confirm-page/sign-up-confirm-page.component';

describe('SignUpConfirmPageComponent', () => {
  let component: SignUpConfirmPageComponent;
  let fixture: ComponentFixture<SignUpConfirmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpConfirmPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
