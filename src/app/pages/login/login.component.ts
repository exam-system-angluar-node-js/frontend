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
  constructor(private router: Router, private authService: AuthService) {}
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
  login() {
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
            next: () => this.router.navigate(['/home']),
            error: (err) => console.log('login error', err),
          });
      }
    } else {
      this.loginForm.markAllAsTouched();
      console.log('error');
    }
  }
}
