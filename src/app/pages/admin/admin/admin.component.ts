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
      id: 3,
      title: 'History Quiz',
      totalQuestions: 10,
      averageScore: 52,
      passRate: 45,
    },
  ];

  recentResults = [
    {
      user: { name: 'Ahmed Ali' },
      exam: { id: 1, title: 'Mathematics Final Exam' },
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

  selectedExamId: number | null = null;
  selectedExam: any = null;
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

  onExamChange(): void {
    this.selectedExam =
      this.exams.find((e) => e.id === this.selectedExamId) || null;
    this.filterResults();
    this.updateCharts();
  }

  private filterResults(): void {
    this.filteredResults = this.selectedExamId
      ? this.recentResults.filter(
          (result) => result.exam.id === this.selectedExamId
        )
      : [...this.recentResults];
  }

  private initCharts(): void {
    // Results Chart
    this.resultsChart = new Chart('resultsChart', {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed'],
        datasets: [
          {
            data: [65, 35],
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
                weight: 'bold'
              },
              padding: 20
            },
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
            cornerRadius: 8
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
    });

    // Activity Chart
    this.activityChart = new Chart('activityChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Exam Attempts',
            data: [120, 190, 150, 220, 180],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
        ],
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
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              display: true
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12
              },
              padding: 10
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
              padding: 10
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      },
    });
  }

  private updateCharts(): void {
    if (this.resultsChart) {
      const passRate = this.selectedExam?.passRate || 65;
      this.resultsChart.data.datasets[0].data = [passRate, 100 - passRate];
      this.resultsChart.update('active');
    }

    if (this.activityChart) {
      const baseData = [120, 190, 150, 220, 180];
      const newData = this.selectedExam
        ? baseData.map((v) => v * (this.selectedExam.passRate / 100))
        : baseData;

      this.activityChart.data.datasets[0].data = newData;
      this.activityChart.update('active');
    }
  }
}
