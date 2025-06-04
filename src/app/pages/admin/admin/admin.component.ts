// admin.component.ts - Merged version with service integration and improved functionality
import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  AdminService,
  DashboardStats,
  ExamResult,
  RecentResult,
} from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ExamService } from '../../../services/exam.service';
import { ExamCountService } from '../../../services/exam-count.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // User information
  currentUser: any = null;
  teacherName: string = 'Admin';

  // Dashboard stats
  dashboardStats: DashboardStats = {
    totalStudents: 0,
    totalExams: 0,
    totalQuestions: 0,
    overallPassRate: 0,
  };

  // Exam results data
  examResults: ExamResult[] = [];
  recentResults: RecentResult[] = [];

  // UI state
  loading = true;
  error: string | null = null;

  // Chart instances
  private resultsChart: Chart | null = null;
  private activityChart: Chart | null = null;
  private dataLoaded = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private examService: ExamService,
    private examCountService: ExamCountService
  ) {
    // Initialize user information
    this.initializeUserInfo();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadExamsForCount();
  }

  ngAfterViewInit(): void {
    // Wait for data to be loaded before initializing charts
    this.waitForDataAndInitCharts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  private initializeUserInfo(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser && this.currentUser.name) {
      this.teacherName = this.currentUser.name;
    }
    console.log('Current user:', this.currentUser);
    console.log('Teacher name:', this.teacherName);
  }

  private loadExamsForCount(): void {
    // Fetch exams for the admin exam count in the sidebar
    this.examService.getAllExamsForTeacher().subscribe(exams => {
      this.examCountService.updateAdminExamCount(exams?.length ?? 0);
    });
  }

  private waitForDataAndInitCharts(): void {
    const checkDataAndInit = () => {
      if (this.dataLoaded && !this.loading) {
        setTimeout(() => {
          this.initializeCharts();
        }, 100);
      } else {
        setTimeout(checkDataAndInit, 100);
      }
    };
    checkDataAndInit();
  }

  private destroyCharts(): void {
    if (this.resultsChart) {
      try {
        this.resultsChart.destroy();
      } catch (error) {
        console.warn('Error destroying results chart:', error);
      }
      this.resultsChart = null;
    }

    if (this.activityChart) {
      try {
        this.activityChart.destroy();
      } catch (error) {
        console.warn('Error destroying activity chart:', error);
      }
      this.activityChart = null;
    }
  }

  private loadDashboardData(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.dataLoaded = false;

    // Load all data simultaneously
    forkJoin({
      stats: this.adminService.getDashboardStats(currentUser.id),
      examResults: this.adminService.getExamResults(),
      recentResults: this.adminService.getRecentResults(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Dashboard data loaded:', data);

          this.dashboardStats = data.stats.data;
          this.examResults = data.examResults;
          this.recentResults = data.recentResults.data;
          this.loading = false;
          this.dataLoaded = true;

          console.log('Data loaded - dashboardStats:', this.dashboardStats);
          console.log('Data loaded - examResults:', this.examResults);
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.error = 'Failed to load dashboard data';
          this.loading = false;
          this.dataLoaded = false;
        },
      });
  }

  private initializeCharts(): void {
    console.log('Initializing charts...');

    // Check if canvas elements exist
    const resultsCanvas = document.getElementById(
      'resultsChart'
    ) as HTMLCanvasElement;
    const activityCanvas = document.getElementById(
      'activityChart'
    ) as HTMLCanvasElement;

    if (!resultsCanvas || !activityCanvas) {
      console.warn('Chart canvas not found.');
      return;
    }

    // Ensure data is loaded before initializing charts
    if (!this.dataLoaded || this.loading) {
      console.log('Data not yet loaded for charts.');
      return;
    }

    // Prepare data for charts
    const examTitles = this.examResults.map(exam => exam.exam.title);
    const totalAttempts = this.examResults.map(exam => exam.totalAttempts);
    const overallPassRate = this.dashboardStats?.overallPassRate || 0;
    const overallFailRate = 100 - overallPassRate;

    // Create Overall Pass Rate Chart (Pie Chart)
    this.resultsChart = new Chart(resultsCanvas, {
      type: 'pie',
      data: {
        labels: ['Passed', 'Failed'],
        datasets: [
          {
            data: [overallPassRate, overallFailRate],
            backgroundColor: ['#4CAF50', '#F44336'], // Green and Red
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Overall Pass Rate' }
        },
      },
    });

    // Create Exam Attempts Chart (Bar Chart)
    this.activityChart = new Chart(activityCanvas, {
      type: 'bar',
      data: {
        labels: examTitles,
        datasets: [
          {
            label: 'Total Attempts',
            data: totalAttempts,
            backgroundColor: '#3F51B5', // Indigo
            borderColor: '#3F51B5',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Number of Attempts' } },
          x: { title: { display: true, text: 'Exam Title' } }
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Exam Attempts' }
        }
      },
    });
  }

  get totalQuestions(): number {
    return this.dashboardStats?.totalQuestions || 0;
  }

  get averageScore(): number {
    return this.dashboardStats?.overallPassRate || 0;
  }

  get totalStudents(): number {
    return this.dashboardStats?.totalStudents || 0;
  }

  get displayPassRate(): number {
    return this.dashboardStats?.overallPassRate || 0;
  }

  get displayTotalQuestions(): number {
    return this.dashboardStats?.totalQuestions || 0;
  }

  refreshData(): void {
    console.log('Refreshing dashboard data...');
    this.loadDashboardData();
    this.loadExamsForCount();
  }

  trackByResultId(index: number, result: RecentResult): number {
    return result.id;
  }
}
