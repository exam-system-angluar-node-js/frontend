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
                this.router.navigate(['/home']);
              },
              error: (err) => console.log('error happen in the register'),
            });
        }
      } else {
        console.log('pass not match');
      }
    } else {
      //make the @if in html work
      this.registerForm.markAllAsTouched();
      console.log('error');
    }
  }
}
