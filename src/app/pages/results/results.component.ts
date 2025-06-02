import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LgcardComponent } from '../../shared/components/lgcard/lgcard.component';
import { DataService, StudentExamResult } from '../../services/data.service';

interface ResultCardData {
  id: number;
  title: string;
  completedAgo: string;
  questionsCount: number;
  scoreText: string;
  scorePercent: number;
}

@Component({
  selector: 'app-results',
  imports: [LgcardComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  results: ResultCardData[] = [];
  loading = true;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    this.loading = true;
    this.error = null;

    this.dataService.getStudentAllResults().subscribe({
      next: (examResults: StudentExamResult[]) => {
        this.results = this.transformResults(examResults);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.error = 'Failed to load results. Please try again.';
        this.loading = false;
      },
    });
  }

  private transformResults(examResults: StudentExamResult[]): ResultCardData[] {
    return examResults.map((result) => ({
      id: result.id,
      title: result.examTitle,
      completedAgo: this.getTimeAgo(result.createdAt),
      questionsCount: result.totalQuestions,
      scoreText: `${result.correctAnswers}/${result.totalQuestions} (${result.score}%)`,
      scorePercent: result.score,
    }));
  }

  private getTimeAgo(dateString: string): string {
    const now = new Date();
    const completedDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - completedDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  onRetry(): void {
    this.loadResults();
  }
}
