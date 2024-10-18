import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SignUpService} from "../../service/auth/sign-up.service";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";

interface SignUpConfirmFormData {
  username: string;
  code: string;
}


@Component({
  selector: 'app-sign-up-confirm-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatButton
  ],
  templateUrl: './sign-up-confirm-page.component.html',
  styleUrl: './sign-up-confirm-page.component.scss'
})
export class SignUpConfirmPageComponent {
  signUpConfirmForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignUpService,
    private router: Router
  ) {
    this.signUpConfirmForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        code: ['', Validators.required]
      }
    );
  }

  onSubmit(): void {
    if (this.signUpConfirmForm.valid) {
      const { username, code } = this.signUpConfirmForm.value as SignUpConfirmFormData
      this.signUpService.confirmSignUp(username, code)
    }
  }

}
