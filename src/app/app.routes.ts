import { Routes } from '@angular/router';
import { DrawPoolGameComponent } from './game/component/draw-pool-game/draw-pool-game.component';
import { SignUpPageComponent } from './engine/component/sign-up-page/sign-up-page.component';
import { SignUpConfirmPageComponent } from './engine/component/sign-up-confirm-page/sign-up-confirm-page.component';
import { LoginPageComponent } from './engine/component/login-page/login-page.component';

export const routes: Routes = [
  { path: 'game', component: DrawPoolGameComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'sign-up', component: SignUpPageComponent },
  { path: 'sign-up-confirm', component: SignUpConfirmPageComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: '**', redirectTo: '/game' },
];
