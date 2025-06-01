// admin.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';


Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements AfterViewInit {
  exams = [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      totalQuestions: 20,
      averageScore: 75,
      passRate: 80,
    },
    {
      id: 2,
      title: 'Science Midterm',
      totalQuestions: 15,
      averageScore: 68,
      passRate: 65,
    },
    {
      id: 4,
      title: 'das Quiz',
      totalQuestions: 10,
      averageScore: 52,
      passRate: 45,
    },
    {
      id: 5,
      title: 'football Quiz',
      totalQuestions: 20,
      averageScore: 10,
      passRate: 50,
    },
    {
      id: 6,
      title: 'arabic Quiz',
      totalQuestions: 10,
      averageScore: 52,
      passRate: 45,
    },
    {
      id: 7,
      title: 'x Quiz',
      totalQuestions: 44,
      averageScore: 10,
      passRate: 45,
    },
    {
      id: 7,
      title: 'x Quiz',
      totalQuestions: 40,
      averageScore: 20,
      passRate: 45,
    },
    {
      id: 7,
      title: 'x Quiz',
      totalQuestions: 77,
      averageScore: 20,
      passRate: 45,
    },
    {
      id: 7,
      title: 'x Quiz',
      totalQuestions: 10,
      averageScore: 20,
      passRate: 45,
    },
    {
      id: 7,
      title: 'x Quiz',
      totalQuestions: 40,
      averageScore: 20,
      passRate: 45,
    },
    {
      id: 7,
      title: 'x Quiz',
      totalQuestions: 4,
      averageScore: 20,
      passRate: 45,
    },
  ];

  recentResults = [
    {
      user: { name: 'Ahmed Ali' },
      exam: { id: 1, title: 'Mathematics Exam' },
      score: 85,
      passed: true,
      createdAt: '2024-05-15',
    },
    {
      user: { name: 'Mona Mohamed' },
      exam: { id: 2, title: 'Science Midterm' },
      score: 72,
      passed: true,
      createdAt: '2024-05-14',
    },
    {
      user: { name: 'Omar Hassan' },
      exam: { id: 3, title: 'History Quiz' },
      score: 45,
      passed: false,
      createdAt: '2024-05-13',
    },
  ];

  filteredResults = [...this.recentResults];
  totalQuestions = this.exams.reduce(
    (sum, exam) => sum + exam.totalQuestions,
    0
  );
  private resultsChart: any;
  private activityChart: any;

  ngAfterViewInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    // Overall Pass/Fail Distribution (Pie Chart)
    this.resultsChart = new Chart('resultsChart', {
      type: 'pie',
      data: {
        labels: ['Passed', 'Failed'],
        datasets: [{
          data: [
            this.exams.reduce((sum, exam) => sum + (exam.averageScore * exam.passRate) / 100, 0),
            this.exams.reduce((sum, exam) => sum + (exam.averageScore * (100 - exam.passRate)) / 100, 0)
          ],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',  // Green for passed
            'rgba(239, 68, 68, 0.8)'    // Red for failed
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }]
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
                weight: 'bold'
              },
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${Math.round(value)} students (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    // Average Scores by Exam (Simple Bar Chart)
    this.activityChart = new Chart('activityChart', {
      type: 'bar',
      data: {
        labels: this.exams.map(exam => exam.title),
        datasets: [{
          label: 'Average Score',
          data: this.exams.map(exam => exam.averageScore),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 4
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => `Average Score: ${context.raw}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              },
              padding: 10
            },
            title: {
              display: true,
              text: 'Score (%)',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#4b5563',
              padding: { top: 10, bottom: 10 }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              },
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }

  // Add calculation methods
  get averageScore(): number {
    return Math.round(this.exams.reduce((sum, exam) => sum + exam.averageScore, 0) / this.exams.length);
  }

  get totalStudents(): number {
    return Math.round(this.exams.reduce((sum, exam) => sum + exam.averageScore, 0));
  }
}
