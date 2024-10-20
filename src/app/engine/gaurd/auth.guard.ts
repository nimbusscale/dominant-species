import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).isLoggedIn) {
    return inject(AuthService).isLoggedIn;
  } else {
    void inject(Router).navigate(['/login']);
    return false;
  }
};
