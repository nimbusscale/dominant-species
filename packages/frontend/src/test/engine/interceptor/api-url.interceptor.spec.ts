import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiUrlInterceptor } from '../../../app/engine/interceptor/api-url.interceptor';

describe('apiUrlInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor])),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useValue: apiUrlInterceptor, multi: true },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add site to URL', () => {
    httpClient.get('/test').subscribe();
    expect(() => {
      httpTestingController.expectOne('https://api.vpa-games.com/v1/test');
    }).not.toThrowError()

  });
});
