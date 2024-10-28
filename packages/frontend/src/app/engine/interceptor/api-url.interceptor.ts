import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export function apiUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const newReq = req.clone({
    url: `${environment.apiEndpoint}${req.url}`,
  });
  return next(newReq);
}
