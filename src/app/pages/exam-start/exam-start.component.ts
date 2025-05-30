import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-exam-start',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-start.component.html',
  styleUrl: './exam-start.component.css'
})
export class ExamStartComponent implements OnInit, OnDestroy {
  examId: string | null = null;
  currentQuestionIndex = 0;
  timeLeft = 45 * 60; // 45 minutes in seconds
  timerInterval: any;
  answers: number[] = [];
  isLoading = true;
  error = false;
  exam: any = null;

  // Sample questions (replace with actual questions from your backend)
  questions: Question[] = [
    {
      id: 1,
      text: 'What is the correct way to declare a variable in JavaScript?',
      choices: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'let x = 5;'],
      correctAnswer: 3,
    },
    {
      id: 2,
      text: 'Which of the following is not a JavaScript data type?',
      choices: ['String', 'Boolean', 'Float', 'Object'],
      correctAnswer: 2,
    },
    {
      id: 3,
      text: 'What does HTML stand for?',
      choices: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyper Transfer Markup Language',
        'Hyper Text Modern Language'
      ],
      correctAnswer: 0,
    }
  ];

  private dataSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    this.dataSubscription = this.dataService.currentData.subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.exam = data[0];
          this.isLoading = false;
          this.startTimer();
          // Initialize answers array
          this.answers = new Array(this.questions.length).fill(-1);
        } else {
          this.error = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  submitExam(): void {
    // Calculate score
    const score = this.answers.reduce((total, answer, index) => {
      return total + (answer === this.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const percentage = (score / this.questions.length) * 100;

    // TODO: Send results to backend
    console.log('Exam submitted', {
      examId: this.examId,
      score: percentage,
      answers: this.answers,
    });

    // Navigate to results page
    this.router.navigate(['/student/results', this.examId]);
  }

  navigateToExams(): void {
    this.router.navigate(['/student/exams']);
  }
} 