import {ChangeDetectorRef, Component} from '@angular/core';
import { SignUpService } from '../../service/auth/sign-up.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatCard, MatCardHeader, MatCardContent, MatButton],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss',
})
export class SignUpPageComponent {
  signUpForm: FormGroup;
  errorMessage: string | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignUpService,
    private router: Router,
  ) {
    this.signUpForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      { updateOn: 'blur' },
    );
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { username, email, password } = this.signUpForm.value as SignUpFormData;
      this.signUpService.signUp(username, email, password).then((success) => {
        if (success) {
          void this.router.navigate(['/sign-up-confirm']);
        } else {
          this.errorMessage = 'Sign up failed. See console for more information.';
        }
      });

    }
  }
}
