import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutPageComponent } from '../../../app/engine/component/logout-page/logout-page.component';
import { AuthService } from '../../../app/engine/service/auth/auth.service';

describe('LogoutPageComponent', () => {
  let component: LogoutPageComponent;
  let fixture: ComponentFixture<LogoutPageComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    await TestBed.configureTestingModule({
      imports: [LogoutPageComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
