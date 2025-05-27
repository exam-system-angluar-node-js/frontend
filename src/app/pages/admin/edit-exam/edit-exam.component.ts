import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditExamComponent implements OnInit {
  examId: string = '';
  showAddQuestionForm: boolean = false;
  editingQuestion: Question | null = null;
  
  // Form data
  examTitle: string = '';
  examDescription: string = '';
  timeLimit: number = 0;
  
  // Question form data
  questionText: string = '';
  choices: string[] = ['', '', '', ''];
  correctAnswer: number = 0;
  
  // Questions list
  questions: Question[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.params['id'];
    this.loadExamData();
  }

  loadExamData(): void {
    // TODO: Implement API call to load exam data
    // This is just sample data
    this.examTitle = 'Sample Exam';
    this.examDescription = 'This is a sample exam description';
    this.timeLimit = 60;
    this.questions = [
      {
        id: 1,
        text: 'What is the capital of France?',
        choices: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 1
      }
    ];
  }

  toggleAddQuestionForm(): void {
    this.showAddQuestionForm = !this.showAddQuestionForm;
    if (!this.showAddQuestionForm) {
      this.resetQuestionForm();
    }
  }

  resetQuestionForm(): void {
    this.questionText = '';
    this.choices = ['', '', '', ''];
    this.correctAnswer = 0;
    this.editingQuestion = null;
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionText = question.text;
    this.choices = [...question.choices];
    this.correctAnswer = question.correctAnswer;
    this.showAddQuestionForm = true;
  }

  onQuestionSubmit(): void {
    if (!this.questionText || this.choices.some(choice => !choice)) {
      return;
    }

    if (this.editingQuestion) {
      // Update existing question
      const index = this.questions.findIndex(q => q.id === this.editingQuestion!.id);
      if (index !== -1) {
        this.questions[index] = {
          ...this.editingQuestion,
          text: this.questionText,
          choices: [...this.choices],
          correctAnswer: this.correctAnswer
        };
      }
    } else {
      // Add new question
      const newQuestion: Question = {
        id: this.questions.length + 1,
        text: this.questionText,
        choices: [...this.choices],
        correctAnswer: this.correctAnswer
      };
      this.questions.push(newQuestion);
    }

    this.toggleAddQuestionForm();
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questions = this.questions.filter(q => q.id !== questionId);
    }
  }

  saveExam(): void {
    // TODO: Implement API call to save exam data
    console.log('Saving exam...', {
      id: this.examId,
      title: this.examTitle,
      description: this.examDescription,
      timeLimit: this.timeLimit,
      questions: this.questions
    });
  }
}