import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: 'app-exams',
  imports: [CardComponent],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class ExamsComponent implements OnInit {
  searchExam: string = '';
  category: string = 'all';
  filteredExams: any[] = [];
  
  exams = [
    { id: 1, title: 'HTML', description: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications.', questionsCount: 15, category: 'frontend', creationDateInput: new Date(2025, 10, 15) },
    { id: 2, title: 'CSS', description: 'CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML or XML.', questionsCount: 15, category: 'frontend', creationDateInput: new Date(2024, 7, 28) },
    { id: 3, title: 'JavaScript', description: 'JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.', questionsCount: 15, category: 'frontend', creationDateInput: new Date(2025, 6, 24) },
    { id: 4, title: 'PHP', description: 'PHP (Hypertext Preprocessor) is a server-side scripting language, and a powerful tool for making dynamic and interactive Web pages.', questionsCount: 15, category: 'backend', creationDateInput: new Date(2025, 5, 4) },
    { id: 5, title: 'Java', description: 'Java is a computer programming language. It is the most popular programming language in the world.', questionsCount: 15, category: 'backend', creationDateInput: new Date(2025, 8, 2) },
    { id: 6, title: 'Python', description: 'Python is a programming language that lets you work quickly and integrate systems more effectively.', questionsCount: 15, category: 'backend', creationDateInput: new Date(2025, 4, 12) },
    { id: 7, title: 'MongoDB', description: 'MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.', questionsCount: 15, category: 'database', creationDateInput: new Date(2025, 2, 14) },
    { id: 8, title: 'postgresql', description: 'PostgreSQL is a free and open-source relational database management system emphasizing extensibility and SQL compliance.', questionsCount: 15, category: 'database', creationDateInput: new Date(2025, 3, 11) },
    { id: 9, title: 'mysql', description: 'MySQL is an open-source relational database management system.', questionsCount: 15, category: 'database' },
  ];

  ngOnInit(): void {
    this.filteredExams = this.exams;
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