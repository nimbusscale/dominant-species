import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpConfirmPageComponent } from '../../../app/engine/component/sign-up-confirm-page/sign-up-confirm-page.component';
import { SignUpService } from '../../../app/engine/service/auth/sign-up.service';

describe('SignUpConfirmPageComponent', () => {
  let component: SignUpConfirmPageComponent;
  let fixture: ComponentFixture<SignUpConfirmPageComponent>;
  let mockSignUpService: jasmine.SpyObj<SignUpService>;

  beforeEach(async () => {
    mockSignUpService = jasmine.createSpyObj('SignUpService', ['confirmSignUp']);
    await TestBed.configureTestingModule({
      imports: [SignUpConfirmPageComponent],
      providers: [{ provide: SignUpService, useValue: mockSignUpService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
