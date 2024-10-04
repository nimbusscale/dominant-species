import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DrawPoolGameComponent } from './game/component/draw-pool-game/draw-pool-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DrawPoolGameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dominant-species';
}
