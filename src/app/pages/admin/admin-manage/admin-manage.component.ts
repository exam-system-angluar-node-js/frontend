import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterLink } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ExamCountService } from '../../../services/exam-count.service';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CardComponent, RouterLink, ConfirmModalComponent],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css',
})
export class AdminManageComponent implements OnInit {
  searchExam: string = '';
  filteredExams: any[] = [];
  category: string = 'all';
  exams: any[] = [];
  showDeleteModal = false;
  examToDelete: number | null = null;
  isDeleting = false;

  constructor(
    private examService: ExamService,
    private toastr: ToastrService,
    private examCountService: ExamCountService
  ) {}

  ngOnInit(): void {
    this.examService.getAllExamsForTeacher().subscribe((exams) => {
      this.exams = exams ?? [];
      this.filteredExams = exams ?? [];
      this.examCountService.updateAdminExamCount(this.exams.length);
      console.log('filtered', this.filteredExams);
    });
  }

  handleDelete(examId: number): void {
    this.examToDelete = examId;
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    if (this.examToDelete) {
      this.isDeleting = true;
      const exam = this.exams.find((e) => e.id === this.examToDelete);

      this.examService.deleteExam(this.examToDelete).subscribe({
        next: () => {
          this.exams = this.exams.filter(
            (exam) => exam.id !== this.examToDelete
          );
          this.filteredExams = this.filteredExams.filter(
            (exam) => exam.id !== this.examToDelete
          );
          this.examCountService.updateAdminExamCount(this.exams.length);
          this.toastr.success(`${exam?.title} has been deleted`, '✅ Deleted');
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
          this.toastr.error('Failed to delete exam', '❌ Error');
        },
        complete: () => {
          this.isDeleting = false;
          this.closeModal();
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.showDeleteModal = false;
    this.examToDelete = null;
  }

  handleSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchExam = inputElement.value.toLowerCase();
    this.applyFilters();
  }

  handleCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.category = selectElement.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter((exam) => {
      const matchesSearch = exam.title.toLowerCase().includes(this.searchExam);
      const matchesCategory =
        this.category === 'all' ||
        exam.category?.toLowerCase() === this.category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }

  hasActiveFilters(): boolean {
    return this.searchExam !== '' || this.category !== 'all';
  }
}
