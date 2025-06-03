import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmcardComponent } from '../../shared/components/smcard/smcard.component';
import { BasechartComponent } from '../../components/basechart/basechart.component';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  DataService,
  StudentExamResult,
  StudentDashboardStats,
  CategoryPerformance,
  ExamData,
} from '../../services/data.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SmcardComponent, BasechartComponent, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = true;
  hasError = false;
  errorMessage = '';
  currentUser: any = null;
  studentName: string = 'Student';
  averageScore:number = 0;
  stats: StudentDashboardStats = {
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    passRate: 0,
    totalQuestions: 0,
    correctAnswers: 0,
  };

  recentResults: StudentExamResult[] = [];

  private performanceChart: Chart | null = null;
  private categoryChart: Chart | null = null;

  constructor(private dataService: DataService,private authService: AuthService) {
    this.initializeUserInfo();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

    private initializeUserInfo(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser && this.currentUser.name) {
      this.studentName = this.currentUser.name;
    }
    console.log('Current user:', this.currentUser);
    console.log('Teacher name:', this.studentName);
  }
  ngOnDestroy() {
    this.performanceChart?.destroy();
    this.categoryChart?.destroy();
  }

  // Add missing methods that the template calls
  refreshData() {
    this.loadDashboardData();
  }

  retryLoadData() {
    this.loadDashboardData();
  }

  calculateAccuracy(): number {
    if (this.stats.totalQuestions === 0) return 0;
    return Math.round(
      (this.stats.correctAnswers / this.stats.totalQuestions) * 100
    );
  }

  trackByResultId(index: number, result: StudentExamResult): any {
    return result.id || index;
  }

  private loadDashboardData() {
    this.isLoading = true;
    this.hasError = false;

    Promise.all([
      this.loadStats(),
      this.loadRecentResults(),
      this.loadChartData(),
    ])
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading dashboard data:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      });
  }

  private async loadStats(): Promise<void> {
    try {
      const stats = await this.dataService
        .getStudentDashboardStats()
        .toPromise();
      this.stats = stats ?? this.stats;
    } catch (error) {
      console.error('Error loading stats:', error);
      throw error;
    }
  }

  private async loadRecentResults(): Promise<void> {
    try {
      const results = await this.dataService
        .getStudentRecentResults(5)
        .toPromise();
      this.recentResults = results ?? [];
    } catch (error) {
      console.error('Error loading recent results:', error);
      throw error;
    }
  }

  private async loadChartData(): Promise<void> {
    try {
      setTimeout(() => {
        this.initializeCharts();
      }, 100);
    } catch (error) {
      console.error('Error loading chart data:', error);
      throw error;
    }
  }

  private async initializeCharts() {
    try {
      await Promise.all([
        this.initializeScoreDistributionChart(),
        this.initializeCategoryChart(),
      ]);
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  }

  private async initializeScoreDistributionChart() {
    const ctx = document.getElementById(
      'performanceChart'
    ) as HTMLCanvasElement;
    if (!ctx) return;

    try {
      const distribution = await this.dataService
        .getStudentScoreDistribution()
        .toPromise();
      const data = distribution ?? [0, 0, 0, 0, 0];
      const total = data.reduce((a, b) => a + b, 0);

      this.performanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
          datasets: [
            {
              data: data,
              backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(234, 179, 8, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(16, 185, 129, 0.8)',
              ],
              borderColor: [
                'rgb(239, 68, 68)',
                'rgb(245, 158, 11)',
                'rgb(234, 179, 8)',
                'rgb(34, 197, 94)',
                'rgb(16, 185, 129)',
              ],
              borderWidth: 2,
              hoverOffset: 15,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: { size: 12 },
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleColor: '#fff',
              titleFont: { size: 14, weight: 'bold' },
              bodyColor: '#fff',
              bodyFont: { size: 13 },
              callbacks: {
                label: (context) => {
                  const value = context.raw as number;
                  const percentage =
                    total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${value} exams (${percentage}%)`;
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
    } catch (error) {
      console.error('Error creating score distribution chart:', error);
    }
  }

  private async initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    try {
      const categoryScores: CategoryPerformance | undefined =
        await this.dataService.getStudentCategoryPerformance().toPromise();

      const labels = Object.keys(categoryScores ?? {});
      const data = Object.values(categoryScores ?? {});

      const colors = this.generateColors(labels.length);

      this.categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Average Score',
              data: data,
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Average: ${context.raw}%`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Score (%)',
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating category chart:', error);
    }
  }

  private generateColors(count: number): {
    background: string[];
    border: string[];
  } {
    const baseColors = [
      { bg: 'rgba(79, 75, 230, 0.8)', border: 'rgb(79, 75, 230)' },
      { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)' },
      { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)' },
      { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' },
      { bg: 'rgba(147, 51, 234, 0.8)', border: 'rgb(147, 51, 234)' },
      { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' },
    ];

    const background: string[] = [];
    const border: string[] = [];

    for (let i = 0; i < count; i++) {
      const color = baseColors[i % baseColors.length];
      background.push(color.bg);
      border.push(color.border);
    }

    return { background, border };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
