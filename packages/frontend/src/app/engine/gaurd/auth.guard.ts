import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { NavigateService } from '../service/navigate.service';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).checkIsLoggedIn()) {
    return inject(AuthService).checkIsLoggedIn();
  } else {
    void inject(NavigateService).toLoginPage();
    return false;
  }
};
