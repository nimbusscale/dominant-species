import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../service/auth/login.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

interface LoginFormData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatButton, MatCard, MatCardContent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errorMessage: string | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value as LoginFormData;
      void this.loginService.login(username, password).then((success) => {
        if (success) {
          void this.router.navigate(['/game']);
        } else {
          this.errorMessage = 'Login failed. See console for more information.';
        }
      });
    }
  }
}
