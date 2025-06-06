import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { ExamCountService } from '../../../services/exam-count.service';

interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  examResults: {
    totalExams: number;
    passedExams: number;
    averageScore: number;
  };
}

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-management.component.html',
})
export class StudentManagementComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  currentUser: any = null;
  loading: boolean = true;
  error: string | null = null;
  showDeleteConfirm: boolean = false;
  studentToDelete: Student | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private examService: ExamService,
    private examCountService: ExamCountService
  ) {
    this.initializeUserInfo();
  }

  ngOnInit() {
    // Redirect if not a teacher
    if (this.currentUser?.role !== 'teacher') {
      window.location.href = '/dashboard';
      return;
    }
    this.loadStudents();
    this.loadExamsForCount();
  }

  private loadExamsForCount(): void {
    // Fetch exams for the admin exam count in the sidebar
    this.examService.getAllExamsForTeacher().subscribe(exams => {
      this.examCountService.updateAdminExamCount(exams?.length ?? 0);
    });
  }

  private initializeUserInfo() {
    this.currentUser = this.authService.getUser();
  }

  loadStudents() {
    this.loading = true;
    this.error = null;
    
    this.dataService.getAllStudents().subscribe({
      next: (response) => {
        this.students = response.data;
        this.filteredStudents = [...this.students];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load students. Please try again later.';
        this.loading = false;
        console.error('Error loading students:', err);
      }
    });
  }

  filterStudents() {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  }

  getPassRate(student: Student): number {
    if (student.examResults.totalExams === 0) return 0;
    return (student.examResults.passedExams / student.examResults.totalExams) * 100;
  }

  getStatusColor(score: number): string {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  confirmDelete(student: Student) {
    this.studentToDelete = student;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.studentToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteStudent() {
    if (!this.studentToDelete) return;

    this.loading = true;
    this.dataService.deleteStudent(this.studentToDelete.id).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.id !== this.studentToDelete?.id);
        this.filteredStudents = this.filteredStudents.filter(s => s.id !== this.studentToDelete?.id);
        this.showDeleteConfirm = false;
        this.studentToDelete = null;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete student. Please try again later.';
        this.loading = false;
        console.error('Error deleting student:', err);
      }
    });
  }
} 