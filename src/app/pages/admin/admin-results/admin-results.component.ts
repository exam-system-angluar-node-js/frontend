import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, RecentResult } from '../../../services/admin.service';

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
  imports: [CommonModule],
  templateUrl: './admin-results.component.html',
  styleUrl: './admin-results.component.css',
})
export class AdminResultsComponent implements OnInit {
  searchQuery: string = '';
  statusFilter: string = 'all';
  filteredResults: Result[] = [];
  results: Result[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getRecentResults().subscribe({
      next: (response) => {
        // Transform backend data to match frontend interface
        this.results = this.transformBackendData(response.data);
        this.filteredResults = this.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.error = 'Failed to load results. Please try again.';
        this.loading = false;
        // Fallback to empty array on error
        this.results = [];
        this.filteredResults = [];
      },
    });
  }

  private transformBackendData(backendResults: RecentResult[]): Result[] {
    return backendResults.map((result) => ({
      id: result.id,
      user: {
        id: 0, // Backend doesn't provide user id in RecentResult
        name: result.user.name,
        email: '', // Backend doesn't provide email in RecentResult
        role: 'student',
      },
      exam: {
        id: 0, // Backend doesn't provide exam id in RecentResult
        title: result.exam.title,
        userId: 0,
      },
      score: result.score,
      passed: result.passed,
      createdAt: result.createdAt,
    }));
  }

  // Method to load results for a specific exam
  loadResultsForExam(examId: number): void {
    this.loading = true;
    this.error = null;

    this.adminService.getRecentResults(examId).subscribe({
      next: (response) => {
        this.results = this.transformBackendData(response.data);
        this.filteredResults = this.results;
        this.applyFilters(); // Reapply current filters
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam results:', error);
        this.error = 'Failed to load exam results. Please try again.';
        this.loading = false;
      },
    });
  }

  // Method to refresh results
  refreshResults(): void {
    this.loadResults();
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
    this.filteredResults = this.results.filter((result) => {
      const matchesSearch =
        result.user.name.toLowerCase().includes(this.searchQuery) ||
        result.exam.title.toLowerCase().includes(this.searchQuery);

      const matchesStatus =
        this.statusFilter === 'all' ||
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
    if (result.passed && result.score !== null && result.score >= 90)
      return { label: 'Excellent', color: 'blue' };
    if (result.passed && result.score !== null && result.score >= 70)
      return { label: 'Passed', color: 'green' };
    if (!result.passed && result.score !== null)
      return { label: 'Failed', color: 'red' };
    return { label: 'Average', color: 'yellow' };
  }

  // Method to export results (placeholder for future implementation)
  exportResults(): void {
    // TODO: Implement export functionality
    console.log('Exporting results...', this.filteredResults);
  }

  // Method to format date for display
  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString; // Return original string if parsing fails
    }
  }
}
