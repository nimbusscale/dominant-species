import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

export function errorHandlerInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && !event.ok) {
        throw new Error(`HTTP ${event.status} error: "${event.body}"`);
      }
    }),
    catchError((error) => {
      console.error(error);
      return throwError(() => error);
    }),
  );
}
