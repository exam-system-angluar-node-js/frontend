import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Exam {
  id: number;
  title: string;
  userId: number;
}

interface Result {
  id: number;
  user: User;
  exam: Exam;
  score: number | null;
  passed: boolean | null;
  createdAt: string;
}

@Component({
  selector: 'app-admin-results',
  imports: [ CommonModule],
  templateUrl: './admin-results.component.html',
  styleUrl: './admin-results.component.css',
})
export class AdminResultsComponent implements OnInit {
  searchQuery: string = '';
  statusFilter: string = 'all';
  filteredResults: Result[] = [];
  
  results: Result[] = [
    {
      id: 1,
      user: { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@email.com', role: 'student' },
      exam: { id: 1, title: 'Mathematics', userId: 1 },
      score: 85,
      passed: true,
      createdAt: '2024-03-15',
    },
    {
      id: 2,
      user: { id: 2, name: 'Sara Ali', email: 'sara@email.com', role: 'student' },
      exam: { id: 2, title: 'Physics', userId: 2 },
      score: 92,
      passed: true,
      createdAt: '2024-03-18',
    },
    {
      id: 3,
      user: { id: 3, name: 'Omar Hassan', email: 'omar@email.com', role: 'student' },
      exam: { id: 3, title: 'Chemistry', userId: 3 },
      score: 68,
      passed: false,
      createdAt: '2024-03-20',
    },
    {
      id: 4,
      user: { id: 4, name: 'Fatima Mahmoud', email: 'fatima@email.com', role: 'student' },
      exam: { id: 4, title: 'Biology', userId: 4 },
      score: 42,
      passed: false,
      createdAt: '2024-03-22',
    },
    {
      id: 5,
      user: { id: 5, name: 'Laila Kamal', email: 'laila@email.com', role: 'student' },
      exam: { id: 5, title: 'English', userId: 5 },
      score: null,
      passed: null,
      createdAt: '2024-03-25',
    },
    {
      id: 6,
      user: { id: 6, name: 'Youssef Ahmed', email: 'youssef@email.com', role: 'student' },
      exam: { id: 6, title: 'History', userId: 6 },
      score: 78,
      passed: true,
      createdAt: '2024-03-28',
    },
  ];

  ngOnInit(): void {
    this.filteredResults = this.results;
  }

  handleSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase();
    this.applyFilters();
  }

  handleStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter = selectElement.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredResults = this.results.filter(result => {
      const matchesSearch = 
        result.user.name.toLowerCase().includes(this.searchQuery) ||
        result.exam.title.toLowerCase().includes(this.searchQuery);
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'passed' && result.passed === true) ||
        (this.statusFilter === 'failed' && result.passed === false) ||
        (this.statusFilter === 'pending' && result.passed === null);
      
      return matchesSearch && matchesStatus;
    });
  }

  // Helper for grade
  getGrade(score: number | null): string {
    if (score === null || score === undefined) return '-';
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  // Helper for status
  getStatus(result: Result): { label: string; color: string } {
    if (result.passed === null) return { label: 'Pending', color: 'zinc' };
    if (result.passed && result.score !== null && result.score >= 90) return { label: 'Excellent', color: 'blue' };
    if (result.passed && result.score !== null && result.score >= 70) return { label: 'Passed', color: 'green' };
    if (!result.passed && result.score !== null) return { label: 'Failed', color: 'red' };
    return { label: 'Average', color: 'yellow' };
  }
}
