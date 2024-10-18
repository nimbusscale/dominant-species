import { Component } from '@angular/core';
import { SignUpService } from '../../service/auth/sign-up.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatCard, MatCardHeader, MatCardContent],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss',
})
export class SignUpPageComponent {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignUpService,
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
      this.signUpService.signUp(username, email, password);
    }
  }
}
