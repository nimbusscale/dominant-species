import { Component } from '@angular/core';
import {SignUpService} from "../../service/auth/sign-up.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private signUpService: SignUpService) {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { username, email, password } = this.signUpForm.value;
      this.signUpService.signUp(username, email, password);
    }
  }

}
