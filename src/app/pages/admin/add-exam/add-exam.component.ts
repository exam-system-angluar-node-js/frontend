import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css'
})
export class AddExamComponent implements OnInit {
  examData = {
    title: '',
    category: '',
    startDate: '',
    status: 'pending',
    duration: 0
  };

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Initialize datepicker
    const datepickerInput = document.querySelector('input[datepicker]');
    if (datepickerInput) {
      // You can add datepicker initialization logic here
      // For example, using a library like flatpickr or ngx-bootstrap
    }
  }

  createExam(): void {
    // Validate form data
    if (!this.examData.title.trim()) {
      this.toastr.error('Please enter exam title', 'Error');
      return;
    }
    if (!this.examData.category.trim()) {
      this.toastr.error('Please enter exam category', 'Error');
      return;
    }
    if (!this.examData.startDate) {
      this.toastr.error('Please select start date', 'Error');
      return;
    }
    if (!this.examData.duration || this.examData.duration <= 0) {
      this.toastr.error('Please enter a valid duration', 'Error');
      return;
    }

    // TODO: Implement API call to create exam
    console.log('Creating exam...', this.examData);

    this.toastr.success('Exam created successfully', 'Success');
    this.router.navigate(['/admin/manage']);
  }

  onSubmit() {
    console.log('Form submitted:', this.examData);
    // Add your form submission logic here
  }
}
