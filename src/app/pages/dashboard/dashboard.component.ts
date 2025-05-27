import { Component } from '@angular/core';
import { SmcardComponent } from '../../shared/components/smcard/smcard.component';
import { BasechartComponent } from '../../components/basechart/basechart.component';

@Component({
  selector: 'app-dashboard',
  imports: [SmcardComponent, BasechartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
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
}
