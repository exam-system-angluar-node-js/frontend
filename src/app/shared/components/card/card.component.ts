import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  constructor(private dataService: DataService, private datePipe: DatePipe) { }
  @Input() exams: Array<{ id: number; title: string; description: string; questionsCount: number, category: string,creationDateInput: string|Date,instructorName: string }> = []
  @Input() id: number = 0;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() category: string = '';
  @Input() questionsCount: number = 0;
  @Input() instructorName : string = '';
  @Input() creationDateInput: string | Date = new Date();
  @Input() manage: boolean = false;
  @Output() delete = new EventEmitter<number>();

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
    const currentExam = this.exams.find(exam => exam.id === this.id);
    if (currentExam) {
      this.dataService.changeData([currentExam]);
    }
  }

  onDelete(): void {
    this.delete.emit(this.id);
}
}