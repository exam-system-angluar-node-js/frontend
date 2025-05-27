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
  @Input() exams: Array<{ id: number; title: string; description: string; questionsCount: number, category: string,creationDateInput: string|Date }> = []
  @Input() id: number = 0;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() category: string = '';
  @Input() questionsCount: number = 0;
  @Input() creationDateInput: string | Date = new Date();
  @Input() manage: boolean = false;
  @Output() delete = new EventEmitter<number>();

  public formattedCreationDate: string = '';

  ngOnInit(): void {
    this.formatCreationDate();
  }
  private formatCreationDate(): void {
    try {
      const dateToFormat = typeof this.creationDateInput === 'string'
        ? new Date(this.creationDateInput)
        : this.creationDateInput;

      this.formattedCreationDate = this.datePipe.transform(dateToFormat, 'mediumDate') || 'Invalid Date';

      if (this.formattedCreationDate === 'Invalid Date') {
        throw new Error('Invalid date format');
      }
    } catch (e) {
      console.error('Date formatting error:', e);
      this.formattedCreationDate = 'Date not available';
    }
  }
  sendExams() {
    this.dataService.changeData(this.exams);
  }
   onDelete(): void {
    try {
      const shouldDelete = confirm(`Are you sure you want to delete "${this.title}"?`);
      
      if (!shouldDelete) return;
      this.delete.emit(this.id);
      console.log(`Exam with ID ${this.id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting exam:', error);

    }
  }
}




