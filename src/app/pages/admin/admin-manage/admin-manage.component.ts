import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterLink } from '@angular/router';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-admin-manage',
  imports: [CardComponent, RouterLink],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css',
})
export class AdminManageComponent implements OnInit {
  searchExam: string = '';
  filteredExams: any[] = [];
  category: string = 'all';
  exams: any[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.examService.getAllExams().subscribe((exams) => {
      this.exams = exams ?? [];
      this.filteredExams = exams ?? [];
      console.log('filtered', this.filteredExams);
    });
  }

  handleDelete(examId: number): void {
    //   this.examService.deleteExam(examId).subscribe(() => {
    //     this.exams = this.exams.filter((exam) => exam.id !== examId);
    //     this.applyFilters();
    //   });
  }

  handleSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchExam = inputElement.value.toLowerCase();
    this.applyFilters();
  }

  handleCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.category = selectElement.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter((exam) => {
      const matchesSearch = exam.title.toLowerCase().includes(this.searchExam);
      const matchesCategory =
        this.category === 'all' ||
        exam.category.toLowerCase() === this.category;
      return matchesSearch && matchesCategory;
    });
  }
}
