import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { DataService, ExamData, StudentExamResult } from '../../services/data.service';
import { fromEvent, Subject, takeUntil, forkJoin } from 'rxjs';

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
  takenExamTitles: Set<string> = new Set();

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

    // Load both exams and results in parallel
    forkJoin({
      exams: this.dataService.getExams(),
      results: this.dataService.getStudentAllResults()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ exams, results }) => {
        console.log('=== DEBUG: Student Results ===');
        console.log('All results:', results);
        
        // Store taken exam titles
        this.takenExamTitles = new Set(results.map(result => result.examTitle));
        console.log('Taken exam titles:', Array.from(this.takenExamTitles));
        
        // Process exams
        this.exams = exams;
        this.filteredExams = exams;
        this.loading = false;

        // Update the exam count in the service
        this.dataService.changeData(exams);

        // Debug: Log transformed exams
        console.log('=== TRANSFORMED EXAMS ===');
        exams.forEach((exam) => {
          console.log(
            `Exam: ${exam.title}, ID: ${exam.id}, Questions: ${exam.questionsCount}, Taken: ${this.isExamTaken(exam.title)}`
          );
        });
        console.log('=== END TRANSFORMED EXAMS ===');
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
    const input = event.target as HTMLInputElement;
    this.searchExam = input.value.toLowerCase();
    this.applyFilters();
  }

  handleCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.category = select.value.toLowerCase();
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
    return this.filteredExams.every(exam => {
      const hasQuestions = 
        (exam.questions && exam.questions.length > 0) || 
        (exam.questionsCount && exam.questionsCount > 0) ||
        (exam.totalQuestions && exam.totalQuestions > 0);
      return !hasQuestions;
    });
  }

  isExamTaken(examTitle: string): boolean {
    return this.takenExamTitles.has(examTitle);
  }
}
