import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordFform!: FormGroup;

  message!: String;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.initForgotPasswordForm();
  }

  initForgotPasswordForm(): void {
    this.forgotPasswordFform = this.formBuilder.group({
      email: ['',[Validators.email, Validators.required]]
    });
  }

  onSubmitPasswordForm(): void {
    this.authService.sendPasswordResetEmail(this.forgotPasswordFform.value.email)
      .then(() => {
        this.message = "L'email de réinitialisation a bien été envoyé"
      })
      .catch(console.error)
  }
}
