import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ExamService, Exam } from '../../../services/exam.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-exam',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css',
})
export class AddExamComponent {
  examForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      durration: [60, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.examForm.invalid) return;

    const authUserJson = localStorage.getItem('auth_user');
    if (!authUserJson) {
      alert('User not found. Please log in again.');
      return;
    }

    const authUser = JSON.parse(authUserJson);
    const userId = authUser?.id;

    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    const examData: Exam = {
      ...this.examForm.value,
      startDate: new Date(), //default
      category: 'programming', // default
      userId: userId,
      status: 'pending', // default
    };

    this.examService.createExam(examData).subscribe({
      next: () => this.router.navigate(['/teacher/manage']),
      error: (err) => console.error('Error creating exam:', err),
    });
  }
}
