import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService, Question } from '../../../services/question.service'; // Update path
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EditExamComponent implements OnInit {
  examId: string = '';
  showAddQuestionForm: boolean = false;
  editingQuestion: Question | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  // Form data
  examTitle: string = '';
  examDescription: string = '';
  timeLimit: number = 0;

  // Question form data
  questionText: string = '';
  choices: string[] = ['', '', '', ''];
  correctAnswer: number = 0;
  points: number = 1; // Added points field

  // Questions list
  questions: Question[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.params['id'];
    this.loadExamData();
  }

  loadExamData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.examService.getExamById(parseInt(this.examId)).subscribe({
      next: (exam) => {
        this.examTitle = exam.title;
        this.examDescription = exam.description;
        this.timeLimit = exam.duration;

        this.questionService.getQuestions(parseInt(this.examId)).subscribe({
          next: (questions) => {
            console.log('questions', questions);

            this.questions = questions;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load questions', err);
            this.isLoading = false;
            this.errorMessage = 'Failed to load questions';
          },
        });
      },
      error: (err) => {
        console.error('Failed to load exam', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load exam details';
      },
    });
  }

  toggleAddQuestionForm(): void {
    this.showAddQuestionForm = !this.showAddQuestionForm;
    if (!this.showAddQuestionForm) {
      this.resetQuestionForm();
    }
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionText = question.title;
    this.choices = [...question.options];
    this.correctAnswer = question.answer;
    this.showAddQuestionForm = true;
  }

  onQuestionSubmit(): void {
    if (!this.questionText || this.choices.some((choice) => !choice)) {
      this.errorMessage = 'Please fill all question fields';
      return;
    }

    const questionData: Question = {
      title: this.questionText,
      options: [...this.choices],
      points: this.points,
      answer: this.correctAnswer,
      examId: parseInt(this.examId),
    };

    if (this.editingQuestion) {
      // Update existing question in the local array
      const index = this.questions.findIndex(
        (q) => q.id === this.editingQuestion!.id
      );
      if (index !== -1) {
        this.questions[index] = { ...this.questions[index], ...questionData };
      }
      this.editingQuestion = null;
    } else {
      // Just add locally
      this.questions.push(questionData);
    }

    // Reset form for next question
    this.resetQuestionForm();
  }

  resetQuestionForm(): void {
    this.questionText = '';
    this.choices = ['', '', '', ''];
    this.correctAnswer = 0;
    this.points = 1;
    this.editingQuestion = null;
    this.errorMessage = '';
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questions = this.questions.filter((q) => q.id !== questionId);
    }
  }

  saveExam(): void {
    const examUpdatePayload = {
      title: this.examTitle,
      description: this.examDescription,
      timeLimit: this.timeLimit,
    };

    this.examService
      .updateExam(parseInt(this.examId), examUpdatePayload)
      .subscribe({
        next: (updatedExam) => {
          console.log(this.questions);
          this.questionService
            .addQuestions(parseInt(this.examId), this.questions)
            .subscribe({
              next: (res) => {
                console.log('Questions saved', res);
                this.router.navigate(['/teacher/manage']);

                // Optional: Show success message or navigate away
              },
              error: (err) => {
                console.error('Failed to save questions', err);
              },
            });
        },
        error: (err) => {
          console.error('Failed to update exam', err);
        },
      });
  }
}
