import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showAlert = false;
  alertMessage = '';
  alertType = 'error';

  constructor(private router: Router, private authService: AuthService) { }
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get getEmail() {
    return this.loginForm.get('email');
  }
  get getPassword() {
    return this.loginForm.get('password');
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  showAlertMessage(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  login() {
    console.log('login clicked');

    if (this.loginForm.status === 'VALID') {
      const email = this.getEmail?.value;
      const password = this.getPassword?.value;
      if (email && password) {
        this.authService
          .login({
            email,
            password,
          })
          .subscribe({
            next: (res: any) => {
              const role = res.user?.role;
              console.log('Logged in as role:', role);

              if (role === 'student') {
                this.showAlertMessage('Login successful! Redirecting to student dashboard...', 'success');
                setTimeout(() => {
                  this.router.navigate(['/student/dashboard']);
                }, 1500);
              } else if (role === 'teacher') {
                this.showAlertMessage('Login successful! Redirecting to teacher dashboard...', 'success');
                setTimeout(() => {
                  this.router.navigate(['/teacher/dashboard']);
                }, 1500);
              } else {
                this.showAlertMessage('Unknown role or not stored yet.', 'error');
              }
            },
            error: (err) => {
              console.log('login error', err);
              this.showAlertMessage('Invalid email or password. Please try again.', 'error');
              this.loginForm.reset();
            },
          });
      }
    } else {
      this.loginForm.markAllAsTouched();
      this.showAlertMessage('Please fill in all required fields correctly.', 'error');
    }
  }
}
