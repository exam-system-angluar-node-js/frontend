import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  providers: [DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  @Input() exams: Array<{
    id: number;
    title: string;
    description: string;
    questionsCount: number;
    category: string;
    creationDateInput: string | Date;
    instructorName: string;
  }> = [];

  @Input() id: number = 0;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() category: string = '';
  @Input() questionsCount: number = 0;
  @Input() instructorName: string = '';
  @Input() creationDateInput: string | Date = new Date();
  @Input() manage: boolean = false;
  @Input() userRole: string = 'teacher'; // Default to teacher, can be 'admin' or 'teacher'

  @Output() delete = new EventEmitter();

  public formattedCreationDate: string = '';

  ngOnInit(): void {
    this.formatCreationDate();
  }

  private formatCreationDate(): void {
    try {
      let dateToFormat: Date;

      if (this.creationDateInput instanceof Date) {
        dateToFormat = this.creationDateInput;
      } else if (typeof this.creationDateInput === 'string') {
        dateToFormat = new Date(this.creationDateInput);
      } else {
        dateToFormat = new Date();
      }

      // Check if the date is valid
      if (isNaN(dateToFormat.getTime())) {
        throw new Error('Invalid date');
      }

      const formatted = this.datePipe.transform(dateToFormat, 'mediumDate');
      this.formattedCreationDate = formatted || 'Date not available';
    } catch (e) {
      console.warn('Date formatting error:', e);
      this.formattedCreationDate = 'Date not available';
    }
  }

  sendExams() {
    const currentExam = this.exams.find((exam) => exam.id === this.id);
    if (currentExam) {
      this.dataService.changeData([currentExam]);
    }
    // Additional logic for viewing exams
    console.log('Viewing exam:', this.id);
  }

  onDelete(): void {
    this.delete.emit(this.id);
  }

  getEditRoute(): string[] {
    // Determine the route based on current URL or user role
    const currentUrl = this.router.url;
    if (currentUrl.includes('/admin/')) {
      return ['/admin', 'manage', 'editexam', this.id.toString()];
    } else if (currentUrl.includes('/teacher/')) {
      return ['/teacher', 'manage', 'editexam', this.id.toString()];
    } else {
      // Default fallback based on userRole
      const baseRoute = this.userRole === 'admin' ? '/admin' : '/teacher';
      return [baseRoute, 'manage', 'editexam', this.id.toString()];
    }
  }
}
