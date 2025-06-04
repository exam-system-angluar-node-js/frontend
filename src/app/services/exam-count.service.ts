import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamCountService {
  private adminExamCountSubject = new BehaviorSubject<number>(0);
  private studentExamCountSubject = new BehaviorSubject<number>(0);
  
  adminExamCount$ = this.adminExamCountSubject.asObservable();
  studentExamCount$ = this.studentExamCountSubject.asObservable();

  updateAdminExamCount(count: number): void {
    this.adminExamCountSubject.next(count);
  }

  updateStudentExamCount(exams: any[]): void {
    // Count only exams that have at least one question
    const validExamsCount = exams.filter(exam => 
      (exam.questions && exam.questions.length > 0) || 
      (exam.questionsCount && exam.questionsCount > 0)
    ).length;
    this.studentExamCountSubject.next(validExamsCount);
  }
} 