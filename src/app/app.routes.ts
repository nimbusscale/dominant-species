import { Routes } from '@angular/router';
import { DrawPoolGameComponent } from './game/component/draw-pool-game/draw-pool-game.component';
import { SignUpPageComponent } from './engine/component/sign-up-page/sign-up-page.component';

export const routes: Routes = [
  { path: 'game', component: DrawPoolGameComponent },
  { path: 'sign-up', component: SignUpPageComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: '**', redirectTo: '/game' },
];
