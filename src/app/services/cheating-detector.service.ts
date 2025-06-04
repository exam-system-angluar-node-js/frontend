import { Injectable } from '@angular/core';
import { CheatingReportService } from './cheating-report.service';

@Injectable({
  providedIn: 'root'
})
export class CheatingDetectorService {
  private studentId: number | null = null;
  private examId: number | null = null;
  private isDetectorActive = false;
  private hiddenCount = 0; // To track multiple hidden events
  private lastHiddenTime = 0; // To prevent multiple reports for a single switch

  constructor(private cheatingReportService: CheatingReportService) { }

  startDetection(studentId: number, examId: number): void {
    this.studentId = studentId;
    this.examId = examId;
    this.isDetectorActive = true;
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    console.log('Cheating detection started for student', studentId, 'on exam', examId);
  }

  stopDetection(): void {
    this.isDetectorActive = false;
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.studentId = null;
    this.examId = null;
    this.hiddenCount = 0;
    this.lastHiddenTime = 0;
    console.log('Cheating detection stopped.');
  }

  private handleVisibilityChange = () => {
    console.log('Visibility changed. Document hidden:', document.hidden);
    if (this.isDetectorActive && document.hidden) {
      const now = Date.now();
      // Prevent multiple reports for rapid switches
      if (now - this.lastHiddenTime > 1000) { // 1 second threshold
        this.hiddenCount++;
        console.warn('Cheating detected: Tab switched or window minimized!', 'Count:', this.hiddenCount);
        console.log('Attempting to send cheating report...');
        this.sendCheatingReport('tab switch');
        this.lastHiddenTime = now;
      }
    }
  };

  private sendCheatingReport(cheatingType: string): void {
    if (this.studentId !== null && this.examId !== null) {
      const report = {
        studentId: this.studentId,
        examId: this.examId,
        cheatingType: cheatingType
      };

      this.cheatingReportService.createReport(report).subscribe({
        next: () => console.log('Cheating report sent successfully'),
        error: (err) => console.error('Failed to send cheating report:', err)
      });
    }
  }

  ngOnDestroy(): void {
    this.stopDetection();
  }
} 