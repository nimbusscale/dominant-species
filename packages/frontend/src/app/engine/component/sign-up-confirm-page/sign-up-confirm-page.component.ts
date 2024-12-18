import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpService } from '../../service/auth/sign-up.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NavigateService } from '../../service/navigate.service';

interface SignUpConfirmFormData {
  username: string;
  code: string;
}

@Component({
  selector: 'app-sign-up-confirm-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatCard, MatCardContent, MatButton],
  templateUrl: './sign-up-confirm-page.component.html',
  styleUrl: './sign-up-confirm-page.component.scss',
})
export class SignUpConfirmPageComponent {
  signUpConfirmForm: FormGroup;
  errorMessage = signal('');

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignUpService,
    private navigate: NavigateService,
  ) {
    this.signUpConfirmForm = this.formBuilder.group({
      username: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signUpConfirmForm.valid) {
      const { username, code } = this.signUpConfirmForm.value as SignUpConfirmFormData;
      void this.signUpService.confirmSignUp(username, code).then((success) => {
        if (success) {
          void this.navigate.toLoginPage();
        } else {
          this.errorMessage.set('Sign up confirmation failed. See console for more information.');
        }
      });
    }
  }
}
