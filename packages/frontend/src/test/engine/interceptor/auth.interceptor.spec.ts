import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../../app/engine/service/auth/auth.service';
import { authInterceptor } from '../../../app/engine/interceptor/auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [], {
      playerAuthData: {
        username: 'tester1',
        accessToken: 'accessToken',
        accessTokenExpire: 100,
        refreshToken: 'refreshToken',
      },
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add Authorization header', () => {
    httpClient.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('accessToken');
  });

  it('should throw an error if no playerAuthData', (done) => {
    // Reconfigure TestBed for this specific test
    const authServiceMockWithoutAuthData = jasmine.createSpyObj<AuthService>('AuthService', [], {
      playerAuthData: undefined,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMockWithoutAuthData },
        { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
      ],
    });

    const httpClient = TestBed.inject(HttpClient);

    httpClient.get('/test').subscribe({
      next: () => done.fail('Expected an error, but request succeeded.'),
      error: (err) => {
        expect(err.message).toBe('No playerAuthData');
        done();
      },
    });
  });
});
