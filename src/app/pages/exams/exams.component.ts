import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { DataService, ExamData } from '../../services/data.service';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-exams',
  imports: [CardComponent],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit, OnDestroy {
  searchExam: string = '';
  category: string = 'all';
  filteredExams: ExamData[] = [];
  exams: ExamData[] = [];
  loading: boolean = true;
  error: string = '';
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadExams();
    // Temporary: Debug the raw API response
    this.debugApiResponse();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Temporary debugging method - remove after fixing
  debugApiResponse(): void {
    this.dataService
      .debugExamData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rawData) => {
          console.log('=== DEBUGGING INSTRUCTOR NAMES ===');
          rawData.forEach((exam, index) => {
            console.log(`Exam ${index + 1} (ID: ${exam.id}):`);
            console.log('- Title:', exam.title);
            console.log('- instructorName:', exam.instructorName);
            console.log('- instructor:', exam.instructor);
            console.log('- teacher:', exam.teacher);
            console.log('- teacherName:', exam.teacherName);
            console.log('- createdBy:', exam.createdBy);
            console.log('- author:', exam.author);
            console.log('- All properties:', Object.keys(exam));
            console.log('---');
          });
          console.log('=== END DEBUGGING ===');
        },
        error: (error) => {
          console.error('Debug API call failed:', error);
        },
      });
  }

  loadExams(): void {
    this.loading = true;
    this.error = '';

    this.dataService
      .getExams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exams: ExamData[]) => {
          this.exams = exams;
          this.filteredExams = exams;
          this.loading = false;

          // Debug: Log transformed exams to see instructor names
          console.log('=== TRANSFORMED EXAMS ===');
          exams.forEach((exam) => {
            console.log(
              `Exam: ${exam.title}, Instructor: "${exam.instructorName}"`
            );
          });
          console.log('=== END TRANSFORMED EXAMS ===');

          // Update DataService with fetched exams data
          this.dataService.changeData(exams);
        },
        error: (error) => {
          console.error('Error loading exams:', error);
          this.error = 'Failed to load exams. Please try again later.';
          this.loading = false;
          this.exams = [];
          this.filteredExams = [];
        },
      });
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

  retryLoading(): void {
    this.loadExams();
  }
  get areAllExamsEmpty(): boolean {
    return this.filteredExams.every(exam => exam.questionsCount < 1);
  }

    refreshResults(): void {
     this.retryLoading();
  }
}
