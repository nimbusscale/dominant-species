import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { NavigateService } from '../../service/navigate.service';

@Component({
  selector: 'app-logout-page',
  standalone: true,
  imports: [],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.scss',
})
export class LogoutPageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private navigate: NavigateService,
  ) {}

  ngOnInit() {
    this.authService.logout();
    void this.navigate.toLoginPage();
  }
}
