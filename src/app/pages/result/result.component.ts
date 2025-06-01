import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  score =67;
  passingScore = 50; // Set your passing threshold here
  completionDate = new Date('2023-04-16T13:45:00');
  currentPage = 0;
  paginationItems: any[] = [];

  stats = [
    { label: 'Correct', value: 2 },
    { label: 'Incorrect', value: 1 },
    { label: 'Total', value: 3 },
    { label: 'Status', value: this.completionDate.toLocaleDateString() }
  ];
  questions = [
    {
      title: 'Question 1',
      text: 'What is the value of x in the equation 2x + 5 = 15?',
      isCorrect: true,
      selectedOption: '5',
      options: [
        { value: '3', isCorrect: false },
        { value: '5', isCorrect: true },
        { value: '7', isCorrect: false },
        { value: '10', isCorrect: false }
      ]
    },
    {
      title: 'Question 2',
      text: 'What is the area of a circle with radius 3?',
      isCorrect: false,
      selectedOption: '6π',
      options: [
        { value: '6π', isCorrect: false },
        { value: '9', isCorrect: false },
        { value: '9π', isCorrect: true },
        { value: '27π', isCorrect: false }
      ]
    },
    {
      title: 'Question 3',
      text: 'Solve for y: 3y - 7 = 14',
      isCorrect: true,
      selectedOption: '7',
      options: [
        { value: '5', isCorrect: false },
        { value: '6', isCorrect: false },
        { value: '7', isCorrect: true },
        { value: '8', isCorrect: false }
      ]
    }
  ];

  constructor() {
    this.paginationItems = Array(this.questions.length).fill(0);
  }

  get currentQuestion() {
    return this.questions[this.currentPage];
  }

  getCorrectAnswer(): string {
    const correctOption = this.currentQuestion.options.find(option => option.isCorrect);
    return correctOption ? correctOption.value : '';
  }

  nextQuestion() {
    if (this.currentPage < this.questions.length - 1) {
      this.currentPage++;
    }
  }

  prevQuestion() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToPage(index: number) {
    this.currentPage = index;
  }
}
