import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService, Question } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import { ToastrService } from 'ngx-toastr';

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
  points: number = 1;

  // Questions list
  questions: Question[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private toastr: ToastrService
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
            this.toastr.error('Failed to load questions', 'Error');
          },
        });
      },
      error: (err) => {
        console.error('Failed to load exam', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load exam details';
        this.toastr.error('Failed to load exam details', 'Error');
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
      this.toastr.error('Please fill in all fields', 'Error');
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
      // Update existing question
      const index = this.questions.findIndex(
        (q) => q.id === this.editingQuestion!.id
      );
      if (index !== -1) {
        this.questions[index] = {
          ...this.questions[index],
          ...questionData,
          id: this.editingQuestion.id, // Preserve the ID
        };
        this.toastr.success('Question updated successfully', 'Success');
      }
      this.editingQuestion = null;
    } else {
      // Add new question - generate temporary ID for local state
      const newQuestion: Question = {
        ...questionData,
        id: Math.max(0, ...this.questions.map((q) => q.id || 0)) + 1,
      };
      this.questions.push(newQuestion);
      this.toastr.success('Question added successfully', 'Success');
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
      this.toastr.success('Question deleted successfully', 'Success');
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
          console.log('Exam updated, saving questions...', this.questions);

          this.questionService
            .addQuestions(parseInt(this.examId), this.questions)
            .subscribe({
              next: (res) => {
                console.log('Questions saved', res);
                this.toastr.success(
                  'Exam changes saved successfully',
                  'Success'
                );

                // Navigate back to manage page after successful save
                setTimeout(() => {
                  this.router.navigate(['/teacher/manage']);
                }, 1500);
              },
              error: (err) => {
                console.error('Failed to save questions', err);
                this.toastr.error('Failed to save questions', 'Error');
              },
            });
        },
        error: (err) => {
          console.error('Failed to update exam', err);
          this.toastr.error('Failed to update exam details', 'Error');
        },
      });
  }
}
