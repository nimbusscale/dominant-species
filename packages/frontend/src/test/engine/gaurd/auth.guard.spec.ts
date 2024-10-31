import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/engine/service/auth/auth.service';
import { authGuard } from '../../../app/engine/gaurd/auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const routeMock = {} as ActivatedRouteSnapshot;
  const stateMock = {} as RouterStateSnapshot;

  beforeEach(() => {
    const authService = jasmine.createSpyObj('AuthService', ['checkIsLoggedIn']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation if user is logged in', () => {
    authServiceSpy.checkIsLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(routeMock, stateMock));

    expect(result).toBeTrue();
  });

  it('should navigate to login if user is not logged in', () => {
    authServiceSpy.checkIsLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(routeMock, stateMock));

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
