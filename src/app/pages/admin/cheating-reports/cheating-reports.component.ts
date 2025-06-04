import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheatingReportService, CheatingReport } from '../../../services/cheating-report.service';
import { ExamCountService } from '../../../services/exam-count.service';
import { ExamService } from '../../../services/exam.service';
import { DataService } from '../../../services/data.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';

interface EnhancedCheatingReport extends CheatingReport {
  studentName?: string;
  examTitle?: string;
}

@Component({
  selector: 'app-cheating-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cheating-reports.component.html',
  styleUrls: ['./cheating-reports.component.css']
})
export class CheatingReportsComponent implements OnInit {
  cheatingReports: EnhancedCheatingReport[] = [];
  pagedReports: EnhancedCheatingReport[] = []; // Data for the current page
  isLoading = true;
  errorMessage: string | null = null;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10; // You can adjust this number
  totalPages = 0;

  constructor(
    private cheatingReportService: CheatingReportService,
    private dataService: DataService,
    private examCountService: ExamCountService,
    private examService: ExamService
  ) { }

  ngOnInit(): void {
    this.loadReports();
    this.loadExamsForCount();
  }
  private loadExamsForCount(): void {
    // Fetch exams for the admin exam count in the sidebar
    this.examService.getAllExamsForTeacher().subscribe(exams => {
      this.examCountService.updateAdminExamCount(exams?.length ?? 0);
    });
  }

  loadReports(): void {
    console.log('Loading cheating reports...');
    this.isLoading = true;
    this.errorMessage = null;
    this.cheatingReportService.getAllReports().pipe(
      switchMap(reports => {
        console.log('Fetched raw reports:', reports);
        if (!reports || reports.length === 0) {
          console.log('No reports found or reports fetch failed, returning empty array.');
          return of([]);
        }
        // Get unique student and exam IDs
        const studentIds = [...new Set(reports.map(r => r.studentId).filter(id => id != null))];
        const examIds = [...new Set(reports.map(r => r.examId).filter(id => id != null))];
        
        console.log('Unique Student IDs to fetch:', studentIds);
        console.log('Unique Exam IDs to fetch:', examIds);

        // Fetch student and exam details, handling errors for individual items
        const studentDetails$ = studentIds.map(id => 
          this.dataService.getUserById(id).pipe(
            map(user => ({ id, name: user.name })),
            catchError(err => {
              console.error(`Failed to fetch student details for ID ${id}:`, err);
              return of({ id, name: `Unknown Student (ID: ${id})` }); // Provide a default on error with indication
            })
          )
        );
        
        const examDetails$ = examIds.map(id => 
          this.dataService.getExamById(id).pipe(
            map(exam => ({ id, title: exam.title })),
            catchError(err => {
              console.error(`Failed to fetch exam details for ID ${id}:`, err);
              return of({ id, title: `Unknown Exam (ID: ${id})` }); // Provide a default on error with indication
            })
          )
        );
        
        // If there are no student or exam IDs to fetch, just return the reports
        if (studentDetails$.length === 0 && examDetails$.length === 0) {
           console.log('No student or exam details to fetch.');
           return of({ reports, students: [], exams: [] });
        }

        return forkJoin({
          reports: of(reports),
          students: forkJoin(studentDetails$),
          exams: forkJoin(examDetails$)
        }).pipe(
          catchError(err => {
             // This catchError would only be hit if forkJoin itself fails after emitting values,
             // which is unlikely with the inner catchErrors already handling individual observable errors.
             console.error('ForkJoin error during details combination:', err);
             // Propagate the error or return a structure that indicates failure
             return throwError(() => new Error('Failed to combine report details.'));
          })
        );
      }),
      catchError(err => {
         // This catchError handles errors from the initial getAllReports() call
         console.error('Error fetching initial reports:', err);
         this.errorMessage = 'Failed to load initial cheating reports.';
         this.isLoading = false; // Ensure loading is false on error
         return of([]); // Return an observable that immediately emits an empty array
      })
    ).subscribe({
      next: (result) => {
        console.log('Reports subscription next received:', result);
        // Check if the result is the empty array returned by the first catchError (initial fetch failure)
        if (Array.isArray(result)) {
             console.log('Received empty array from initial fetch error handler.');
             this.cheatingReports = []; // Ensure reports list is empty
        } else if (result) { // Check if result is the forkJoin object
          const { reports, students, exams } = result;
           console.log('Processing reports with fetched details...', { reports, students, exams });
          this.cheatingReports = reports.map(report => ({
            ...report,
            // Find student name, fall back to 'Unknown Student' or ID if not found
            studentName: students.find(s => s.id === report.studentId)?.name || (report.studentId ? `Unknown Student (ID: ${report.studentId})` : 'Unknown Student'),
            // Find exam title, fall back to 'Unknown Exam' or ID if not found
            examTitle: exams.find(e => e.id === report.examId)?.title || (report.examId ? `Unknown Exam (ID: ${report.examId})` : 'Unknown Exam')
          }));
           console.log('Final processed reports for display:', this.cheatingReports);
        } else {
            console.log('Received unexpected null or undefined result.');
            this.cheatingReports = [];
        }
        // Only set isLoading to false here if the initial fetch did NOT error out
        if (!this.errorMessage) {
            this.isLoading = false;
        }
        this.calculateTotalPages(); // Calculate total pages after data is loaded
        this.paginateReports(); // Paginate the initial data
      },
      error: (err) => {
        // This error block will be hit if the forkJoin pipe's catchError re-throws,
        // or for any errors not caught elsewhere in the observable chain.
        console.error('Reports subscription error:', err);
        this.errorMessage = err.message || 'An unexpected error occurred while loading reports.';
        this.isLoading = false;
      },
      complete: () => { // Add complete handler for debugging
           console.log('Reports subscription complete.');
           // Ensure isLoading is false on completion
            this.isLoading = false;
      }
    });
  }

  // Pagination methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.cheatingReports.length / this.itemsPerPage);
  }

  paginateReports(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedReports = this.cheatingReports.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateReports();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // CSV Export method
  exportToCsv(): void {
    if (this.cheatingReports.length === 0) {
      console.warn('No reports to export.');
      return;
    }

    const replacer = (key: string, value: any) => (value === null ? '' : value); // Handle null values
    const header = ['Report ID', 'Student Name', 'Exam Title', 'Timestamp', 'Cheating Type'];
    const csv = this.cheatingReports.map(report => header.map(fieldName => {
        // Map header names to report object properties
        switch (fieldName) {
            case 'Report ID': return JSON.stringify(report.id, replacer);
            case 'Student Name': return JSON.stringify(report.studentName || '', replacer);
            case 'Exam Title': return JSON.stringify(report.examTitle || '', replacer);
            case 'Timestamp': return JSON.stringify(report.timestamp, replacer);
            case 'Cheating Type': return JSON.stringify(report.cheatingType, replacer);
            default: return '';
        }
    }).join(','));

    csv.unshift(header.join(',')); // Add header row
    const csvString = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    a.setAttribute('href', url);
    a.setAttribute('download', 'cheating-reports.csv');
    a.click();

    URL.revokeObjectURL(url);
  }
} 