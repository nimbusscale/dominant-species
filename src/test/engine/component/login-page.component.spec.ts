import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginPageComponent } from '../../../app/engine/component/login-page/login-page.component';
import {LoginService} from "../../../app/engine/service/auth/login.service";

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock LoginService
class MockLoginService {
  login(username: string, password: string) {
    return Promise.resolve(true); // or false to simulate failed login
  }
}

// Mock ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'mockValue' // Mock param values if necessary
    }
  }
};

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: Router, useClass: MockRouter }, // Mock Router
        { provide: LoginService, useClass: MockLoginService }, // Mock LoginService
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Mock ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
