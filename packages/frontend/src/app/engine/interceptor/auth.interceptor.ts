import {HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "../service/auth/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const playerAuthData = inject(AuthService).playerAuthData
  if (!playerAuthData) {
    throw new Error('No playerAuthData')
  }

  const newReq = req.clone({
    headers: req.headers.append('Authorization', playerAuthData.accessToken),
  });
  return next(newReq);
}
