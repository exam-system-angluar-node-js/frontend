import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: number;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  category: string;
  creationDateInput: Date | string;
}

@Component({
  selector: 'app-exam',
  imports: [FormsModule, CommonModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent implements OnInit, OnDestroy {
  exams: Exam[] = [];
  filterdExam: Exam | null = null;
  dataSubscription!: Subscription;
  path!: string | null;
  isLoading = true;
  error = false;

  // Exam state
  currentQuestionIndex = 0;
  timeLeft = 45 * 60; // 45 minutes in seconds
  timerInterval: any;
  answers: number[] = [];

  // Sample questions (replace with actual questions from your backend)
  questions: Question[] = [
    {
      id: 1,
      text: 'What is the correct way to declare a variable in JavaScript?',
      choices: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'let x = 5;'],
      correctAnswer: 3,
    },
    // Add more questions here
  ];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.paramMap.get('id');
    this.dataSubscription = this.dataService.currentData.subscribe({
      next: (exams) => {
        if (Array.isArray(exams) && exams.length > 0) {
          this.exams = exams;
          const foundExam = this.exams.find((exam) => exam.id === Number(this.path));
          this.filterdExam = foundExam || null;
          this.isLoading = false;
          if (!this.filterdExam) {
            this.error = true;
          }
        } else {
          this.error = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error = true;
        this.isLoading = false;
      },
    });

    // Initialize answers array
    this.answers = new Array(this.questions.length).fill(-1);
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
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

  selectAnswer(choiceIndex: number): void {
    this.answers[this.currentQuestionIndex] = choiceIndex;
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
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
      examId: this.path,
      score: percentage,
      answers: this.answers,
    });
  }

  startExam(): void {
    if (this.filterdExam) {
      this.router.navigate(['/student/exams', this.path, 'start']);
    }
  }

  // Add public method for navigation
  navigateToExams(): void {
    this.router.navigate(['/student/exams']);
  }
}




























