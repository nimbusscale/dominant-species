import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPageComponent } from '../../../app/engine/component/sign-up-page/sign-up-page.component';
import { SignUpService } from '../../../app/engine/service/auth/sign-up.service';

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;
  let mockSignUpService: jasmine.SpyObj<SignUpService>;

  beforeEach(async () => {
    mockSignUpService = jasmine.createSpyObj('SignUpService', ['signUp']);
    await TestBed.configureTestingModule({
      imports: [SignUpPageComponent],
      providers: [{ provide: SignUpService, useValue: mockSignUpService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
