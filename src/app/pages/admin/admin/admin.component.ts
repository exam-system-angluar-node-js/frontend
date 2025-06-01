// admin.component.ts - Updated to include teacher name
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
  selectedExamId: number | null = null;
  selectedExam: ExamResult | null = null;
  filteredResults: RecentResult[] = [];
  loading = true;
  error: string | null = null;

  // Chart instances
  private resultsChart: Chart | null = null;
  private activityChart: Chart | null = null;
  private dataLoaded = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {
    // Initialize user information
    this.initializeUserInfo();
  }

  ngOnInit(): void {
    this.loadDashboardData();
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
          this.filteredResults = [...this.recentResults];
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

  onExamChange(): void {
    console.log('Exam selection changed to:', this.selectedExamId);

    // Update selected exam reference
    this.selectedExam = this.selectedExamId
      ? this.examResults.find((e) => e.id === this.selectedExamId) || null
      : null;

    console.log('Selected exam object:', this.selectedExam);

    // Load filtered data if exam is selected
    if (this.selectedExamId) {
      this.loadFilteredData(this.selectedExamId);
    } else {
      // Reset to show all data
      this.filteredResults = [...this.recentResults];
      this.recreateCharts();
    }
  }

  private loadFilteredData(examId: number): void {
    console.log('Loading filtered data for examId:', examId);

    this.adminService
      .getRecentResults(examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Filtered data received:', data);
          this.filteredResults = data.data;
          this.error = null;

          // Recreate charts with new data
          this.recreateCharts();
        },
        error: (error) => {
          console.error('Error loading filtered data:', error);

          if (error.status === 404) {
            this.error = 'Exam results not found';
          } else if (error.status === 0) {
            this.error = 'Unable to connect to server';
          } else {
            this.error = 'Failed to load filtered data';
          }

          // Fallback to client-side filtering
          console.log('Falling back to client-side filtering');
          this.filterResults();
          this.recreateCharts();
        },
      });
  }

  private filterResults(): void {
    if (this.selectedExamId && this.selectedExam) {
      this.filteredResults = this.recentResults.filter(
        (result) => result.exam.title === this.selectedExam?.exam.title
      );
    } else {
      this.filteredResults = [...this.recentResults];
    }
    console.log('Filtered results:', this.filteredResults.length);
  }

  private recreateCharts(): void {
    console.log('Recreating charts...');

    // Destroy existing charts
    this.destroyCharts();

    // Wait a bit for cleanup, then recreate
    setTimeout(() => {
      this.initializeCharts();
    }, 200);
  }

  private initializeCharts(): void {
    console.log('Initializing charts...');
    console.log('Current displayPassRate:', this.displayPassRate);

    // Check if canvas elements exist
    const resultsCanvas = document.getElementById(
      'resultsChart'
    ) as HTMLCanvasElement;
    const activityCanvas = document.getElementById(
      'activityChart'
    ) as HTMLCanvasElement;

    if (!resultsCanvas || !activityCanvas) {
      console.warn('Canvas elements not found');
      return;
    }

    try {
      // Create Results Chart (Doughnut)
      const passRate = this.displayPassRate;
      const failRate = 100 - passRate;

      console.log('Creating results chart with data:', [passRate, failRate]);

      this.resultsChart = new Chart(resultsCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed'],
          datasets: [
            {
              data: [passRate, failRate],
              backgroundColor: ['#10b981', '#ef4444'],
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#6b7280',
                font: {
                  size: 14,
                  weight: 'bold',
                },
                padding: 20,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: 'bold',
              },
              bodyFont: {
                size: 13,
              },
              cornerRadius: 8,
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  return `${label}: ${value.toFixed(1)}%`;
                },
              },
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });

      // Create Activity Chart (Line)
      const activityData = this.generateActivityData();
      console.log('Creating activity chart with data:', activityData);

      this.activityChart = new Chart(activityCanvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Exam Attempts',
              data: activityData,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#8b5cf6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: 'bold',
              },
              bodyFont: {
                size: 13,
              },
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                display: true,
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 12,
                },
                padding: 10,
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 12,
                },
                padding: 10,
              },
            },
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
          },
        },
      });

      console.log('Charts created successfully');
    } catch (error) {
      console.error('Error creating charts:', error);
      this.destroyCharts();
    }
  }

  private generateActivityData(): number[] {
    if (this.examResults.length === 0) {
      return [5, 8, 12, 15, 10];
    }

    let baseData: number[];

    if (this.selectedExam && this.selectedExam.totalAttempts > 0) {
      // Use selected exam data
      const examAttempts = this.selectedExam.totalAttempts;
      const avgAttempts = Math.max(1, Math.floor(examAttempts / 5));

      baseData = [
        Math.max(1, avgAttempts - Math.floor(avgAttempts * 0.3)),
        Math.max(1, avgAttempts - Math.floor(avgAttempts * 0.1)),
        Math.max(1, avgAttempts + Math.floor(avgAttempts * 0.2)),
        Math.max(1, avgAttempts + Math.floor(avgAttempts * 0.1)),
        avgAttempts,
      ];

      console.log(
        'Activity data for selected exam:',
        this.selectedExam.exam.title,
        baseData
      );
    } else {
      // Use overall data
      const totalAttempts = this.examResults.reduce(
        (sum, exam) => sum + exam.totalAttempts,
        0
      );

      if (totalAttempts === 0) {
        return [5, 8, 12, 15, 10];
      }

      const avgAttempts = Math.max(
        1,
        Math.floor(totalAttempts / (5 * this.examResults.length))
      );

      baseData = [
        Math.max(1, avgAttempts - 3),
        Math.max(1, avgAttempts + 2),
        Math.max(1, avgAttempts - 1),
        Math.max(1, avgAttempts + 4),
        avgAttempts,
      ];

      console.log('Activity data for all exams:', baseData);
    }

    return baseData;
  }

  // Helper methods for template
  get totalQuestions(): number {
    return this.dashboardStats?.totalQuestions || 0;
  }

  get displayPassRate(): number {
    if (this.selectedExam) {
      const passRate =
        this.selectedExam.totalAttempts > 0
          ? Math.round(
              (this.selectedExam.passedAttempts /
                this.selectedExam.totalAttempts) *
                100
            )
          : 0;
      console.log(
        `Selected exam "${this.selectedExam.exam.title}" pass rate:`,
        passRate,
        `(${this.selectedExam.passedAttempts}/${this.selectedExam.totalAttempts})`
      );
      return passRate;
    }

    const overallRate = this.dashboardStats?.overallPassRate || 0;
    console.log('Overall pass rate:', overallRate);
    return overallRate;
  }

  get displayTotalQuestions(): number {
    return this.dashboardStats?.totalQuestions || 0;
  }

  refreshData(): void {
    console.log('Refreshing data...');
    this.selectedExamId = null;
    this.selectedExam = null;
    this.destroyCharts();
    this.loadDashboardData();
  }

  // TrackBy functions for performance optimization
  trackByExamId(index: number, exam: ExamResult): number {
    return exam.id;
  }

  trackByResultId(index: number, result: RecentResult): number {
    return result.id;
  }
}
