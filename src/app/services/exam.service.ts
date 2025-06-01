import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Exam {
  id?: number;
  title: string;
  description: string;
  startDate: Date;
  durration: number;
  category?: string;
  status?: string;
  userId?: number;
  questions?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private baseUrl = 'http://localhost:3000/api/v1/exams';

  constructor(private http: HttpClient) {}

  getAllExams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/teacher`);
  }

  createExam(exam: Exam): Observable<any> {
    return this.http.post(`${this.baseUrl}`, exam);
  }

  getExamById(examId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${examId}`);
  }

  updateExam(examId: number, examData: Partial<Exam>): Observable<Exam> {
    console.log(this.baseUrl);
    return this.http.patch<Exam>(`${this.baseUrl}/${examId}`, examData);
  }

  submitExam(
    resultId: number,
    answers: { [questionId: number]: number }
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit/${resultId}`, { answers });
  }
}
