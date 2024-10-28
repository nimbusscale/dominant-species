import { TestBed } from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorHandlerInterceptor } from '../../../app/engine/interceptor/error-handler.interceptor';

describe('errorHandlerInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withFetch(),
          withInterceptors([errorHandlerInterceptor])),
        provideHttpClientTesting(),
        {provide: HTTP_INTERCEPTORS, useValue: errorHandlerInterceptor, multi: true},
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should handle 404 error', (done) => {
    const consoleSpy = spyOn(console, 'error');

    httpClient.get('/test').subscribe({
      next: () => done.fail('Expected an error, but got a response.'),
      error: (error) => {
        expect(error.message).toContain('404 Not Found');
        expect(consoleSpy).toHaveBeenCalled();
        done();
      }
    });

    const req = httpTestingController.expectOne('/test');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
