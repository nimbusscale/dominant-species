import { Routes } from '@angular/router';
import {SignUpComponent} from "./engine/component/sign-up/sign-up.component";
import {DrawPoolGameComponent} from "./game/component/draw-pool-game/draw-pool-game.component";

export const routes: Routes = [
  { path: 'game', component: DrawPoolGameComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: '**', redirectTo: '/game' }
];
