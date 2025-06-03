import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { ExamService, Exam } from '../../../services/exam.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css',
})
export class AddExamComponent {
  examForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      category: ['', Validators.required],
      status: ['pending', Validators.required]
    });
  }

  onSubmit() {
    if (this.examForm.invalid) {
      this.toastr.error('Please fill all required fields correctly', 'Error');
      return;
    }

    const authUserJson = localStorage.getItem('auth_user');
    if (!authUserJson) {
      this.toastr.error('User not found. Please log in again.', 'Error');
      return;
    }

    const authUser = JSON.parse(authUserJson);
    const userId = authUser?.id;

    if (!userId) {
      this.toastr.error('User ID not found. Please log in again.', 'Error');
      return;
    }

    const examData: Exam = {
      ...this.examForm.value,
      userId,
    };

    this.examService.createExam(examData).subscribe({
      next: () => {
        this.toastr.success('Exam created successfully', 'Success');
        this.router.navigate(['/teacher/manage']);
      },
      error: (err) => {
        console.error('Error creating exam:', err);
        this.toastr.error('Failed to create exam', 'Error');
      },
    });
  }
}
