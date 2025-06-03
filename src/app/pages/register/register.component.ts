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
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  showAlert = false;
  alertMessage = '';
  alertType = 'error';

  constructor(private router: Router, private authService: AuthService) {}
  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z]+$/),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    role: new FormControl('', [Validators.required]),
  });
  get getName() {
    return this.registerForm.get('username');
  }
  get getEmail() {
    return this.registerForm.get('email');
  }
  get getPassword() {
    return this.registerForm.get('password');
  }
  get getConfirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  get getRole() {
    return this.registerForm.get('role');
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  showAlertMessage(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
  register() {
    const name = this.getName?.value;
    const email = this.getEmail?.value;
    const password = this.getPassword?.value;
    const confirmPassword = this.getConfirmPassword?.value;
    const role = this.getRole?.value;

    if (this.registerForm.status === 'VALID') {
      if (this.getPassword?.value === this.getConfirmPassword?.value) {
        console.log(this.registerForm.value);
        if (name && email && password && confirmPassword && role) {
          this.authService
            .register({
              name,
              email,
              password,
              confirmPassword,
              role,
            })
            .subscribe({
              next: () => {
                this.showAlertMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 1500);
              },
              error: (err) => {
                console.log('error happen in the register', err);
                if (err.status === 409) {
                  this.showAlertMessage('Email already registered. Please use a different email.', 'error');
                } else {
                  this.showAlertMessage('Registration failed. Please try again.', 'error');
                }
                this.registerForm.reset();
              },
            });
        }
      } else {
        this.showAlertMessage('Passwords do not match. Please try again.', 'error');
      }
    } else {
      this.registerForm.markAllAsTouched();
      this.showAlertMessage('Please fill in all required fields correctly.', 'error');
    }
  }
}
