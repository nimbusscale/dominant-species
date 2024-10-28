import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).checkIsLoggedIn()) {
    return inject(AuthService).checkIsLoggedIn();
  } else {
    void inject(Router).navigate(['/login']);
    return false;
  }
};
