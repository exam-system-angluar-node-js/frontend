import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z]+$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
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
  register() {
    if (this.registerForm.status === 'VALID') {
      if (this.getPassword?.value === this.getConfirmPassword?.value) {
        console.log(this.registerForm.value);
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
