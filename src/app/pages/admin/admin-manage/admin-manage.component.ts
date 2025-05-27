import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterLink } from '@angular/router';




@Component({
  selector: 'app-admin-manage',
  imports: [CardComponent, RouterLink],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css'
})
export class AdminManageComponent implements OnInit {
  searchExam: string = '';
  filteredExams: any[] = []
  category: string = 'all';
  exams = [
    { id: 1, title: 'HTML', description: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications.', questionsCount: 15, category: 'frontend' },
    { id: 2, title: 'CSS', description: 'CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML or XML.', questionsCount: 15, category: 'frontend' },
    { id: 3, title: 'JavaScript', description: 'JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.', questionsCount: 15, category: 'frontend' },
    { id: 4, title: 'PHP', description: 'PHP (Hypertext Preprocessor) is a server-side scripting language, and a powerful tool for making dynamic and interactive Web pages.', questionsCount: 15, category: 'backend' },
    { id: 5, title: 'Java', description: 'Java is a computer programming language. It is the most popular programming language in the world.', questionsCount: 15, category: 'backend' },
    { id: 6, title: 'Python', description: 'Python is a programming language that lets you work quickly and integrate systems more effectively.', questionsCount: 15, category: 'backend' },
    { id: 7, title: 'MongoDB', description: 'MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.', questionsCount: 15, category: 'database' },
    { id: 8, title: 'postgresql', description: 'PostgreSQL is a free and open-source relational database management system emphasizing extensibility and SQL compliance.', questionsCount: 15, category: 'database' },
    { id: 9, title: 'mysql', description: 'MySQL is an open-source relational database management system.', questionsCount: 15, category: 'database' },

  ]

  ngOnInit(): void {
    this.filteredExams = this.exams
  }
  handleDelete(examId: number): void {
    this.exams = this.exams.filter((exam) => exam.id !== examId);
    this.filteredExams = this.exams
    this.applyFilters();
  }
  handleSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchExam = inputElement.value.toLowerCase();
    this.applyFilters();
  }

  handleCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.category = selectElement.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(this.searchExam);
      const matchesCategory = this.category === 'all' || exam.category.toLowerCase() === this.category;
      return matchesSearch && matchesCategory;
    });
  }
}
