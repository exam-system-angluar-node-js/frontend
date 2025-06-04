import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheatingReport {
  id?: number;
  studentId: number;
  examId: number;
  timestamp?: Date;
  cheatingType: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheatingReportService {
  private baseUrl = 'http://localhost:3000/api/v1/cheating-reports';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  createReport(report: CheatingReport): Observable<CheatingReport> {
    return this.http.post<CheatingReport>(this.baseUrl, report, { headers: this.getHeaders() });
  }

  getAllReports(): Observable<CheatingReport[]> {
    return this.http.get<CheatingReport[]>(this.baseUrl, { headers: this.getHeaders() });
  }
} 