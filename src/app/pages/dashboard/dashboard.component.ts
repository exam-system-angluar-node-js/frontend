import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmcardComponent } from '../../shared/components/smcard/smcard.component';
import { BasechartComponent } from '../../components/basechart/basechart.component';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

Chart.register(...registerables);

interface ExamResult {
  id: number;
  examTitle: string;
  score: number;
  passed: boolean;
  createdAt: string;
  category: string;
  correctAnswers: number;
  totalQuestions: number;
}

interface DashboardStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  passRate: number;
  totalQuestions: number;
  correctAnswers: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SmcardComponent, BasechartComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Stats for cards
  stats: DashboardStats = {
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    passRate: 0,
    totalQuestions: 0,
    correctAnswers: 0
  };

  // Recent exam results
  recentResults: ExamResult[] = [
    {
      id: 1,
      examTitle: 'Mathematics Final Exam',
      score: 85,
      passed: true,
      createdAt: '2024-05-15',
      category: 'Mathematics',
      correctAnswers: 17,
      totalQuestions: 20
    },
    {
      id: 2,
      examTitle: 'Science Midterm',
      score: 72,
      passed: true,
      createdAt: '2024-05-14',
      category: 'Science',
      correctAnswers: 11,
      totalQuestions: 15
    },
    {
      id: 3,
      examTitle: 'History Quiz',
      score: 45,
      passed: false,
      createdAt: '2024-05-13',
      category: 'History',
      correctAnswers: 5,
      totalQuestions: 10
    }
  ];
  
  // Chart instances
  private performanceChart: Chart | null = null;
  private categoryChart: Chart | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  }

  private loadDashboardData() {
    // TODO: Replace with actual API calls
    // Example of how the data structure would look from API
    const mockData = {
      stats: {
        totalExams: 12,
        completedExams: 8,
        averageScore: 78.5,
        passRate: 75,
        totalQuestions: 120,
        correctAnswers: 94
      },
      recentResults: [
        {
          id: 1,
          examTitle: 'Mathematics Final Exam',
          score: 85,
          passed: true,
          createdAt: '2024-05-15',
          category: 'Mathematics',
          correctAnswers: 17,
          totalQuestions: 20
        },
        {
          id: 2,
          examTitle: 'Science Midterm',
          score: 72,
          passed: true,
          createdAt: '2024-05-14',
          category: 'Science',
          correctAnswers: 11,
          totalQuestions: 15
        },
        {
          id: 3,
          examTitle: 'History Quiz',
          score: 45,
          passed: false,
          createdAt: '2024-05-13',
          category: 'History',
          correctAnswers: 5,
          totalQuestions: 10
        }
      ]
    };

    // Update component data
    this.stats = mockData.stats;
    this.recentResults = mockData.recentResults;

    // Initialize charts after data is loaded
    this.initializeCharts();
  }

  private initializeCharts() {
    this.initializeScoreDistributionChart();
    this.initializeCategoryChart();
  }

  private initializeScoreDistributionChart() {
    const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Calculate score distribution
    const distribution = this.calculateScoreDistribution();
    const total = distribution.reduce((a, b) => a + b, 0);

    this.performanceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
        datasets: [{
          data: distribution,
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',   // Red for low scores
            'rgba(245, 158, 11, 0.8)',  // Orange for below average
            'rgba(234, 179, 8, 0.8)',   // Yellow for average
            'rgba(34, 197, 94, 0.8)',   // Green for good
            'rgba(16, 185, 129, 0.8)'   // Emerald for excellent
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(234, 179, 8)',
            'rgb(34, 197, 94)',
            'rgb(16, 185, 129)'
          ],
          borderWidth: 2,
          hoverOffset: 15
        }]
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
              font: {
                size: 12
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyColor: '#fff',
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = Math.round((value / total) * 100);
                return `${value} exams (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  private calculateScoreDistribution(): number[] {
    const distribution = [0, 0, 0, 0, 0]; // Initialize array for 5 ranges

    this.recentResults.forEach(result => {
      const score = result.score;
      if (score <= 20) distribution[0]++;
      else if (score <= 40) distribution[1]++;
      else if (score <= 60) distribution[2]++;
      else if (score <= 80) distribution[3]++;
      else distribution[4]++;
    });

    return distribution;
  }

  private initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Calculate average scores by category
    const categoryScores = this.calculateCategoryScores();

    this.categoryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryScores),
        datasets: [{
          label: 'Average Score',
          data: Object.values(categoryScores),
          backgroundColor: [
            'rgba(79, 75, 230, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ],
          borderColor: [
            'rgb(79, 75, 230)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `Average: ${context.raw}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score (%)'
            }
          }
        }
      }
    });
  }

  private calculateCategoryScores(): { [key: string]: number } {
    const categoryScores: { [key: string]: number[] } = {};
    
    this.recentResults.forEach(result => {
      if (!categoryScores[result.category]) {
        categoryScores[result.category] = [];
      }
      categoryScores[result.category].push(result.score);
    });

    const averages: { [key: string]: number } = {};
    Object.keys(categoryScores).forEach(category => {
      const scores = categoryScores[category];
      averages[category] = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      );
    });

    return averages;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateAccuracy(): number {
    if (this.stats.totalQuestions === 0) return 0;
    return Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100);
  }
}
