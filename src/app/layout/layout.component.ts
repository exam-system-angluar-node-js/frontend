import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FocusModeService } from '../services/focus-mode.service';
import { AuthService } from '../services/auth.service';
import { DataService, ExamData } from '../services/data.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  togglerState: boolean = false
  focusMode: boolean = false;
  currentUser: any = null;
  user: string = '';
  examsLength: number = 0
  constructor(
    private focusModeService: FocusModeService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.initializeUserInfo();
  }

  ngOnInit() {
    this.focusModeService.focusMode$.subscribe(mode => {
      this.focusMode = mode;
      this.cdr.detectChanges();
    });
    this.dataService
      .getExams()
      .subscribe({
        next: (exams: ExamData[]) => {
          this.examsLength = exams.length;
        }
      })
  }
  private initializeUserInfo(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.user = this.currentUser;
    }
  }

  onToggleState(state: boolean) {
    this.togglerState = state
    console.log(this.togglerState)
  }

  keydownListener = (event: KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'F12' || event.ctrlKey || event.altKey || event.metaKey) {
      event.preventDefault();
      return false;
    }
    return true;
  };

  contextMenuListener = (event: MouseEvent) => {
    event.preventDefault();
    return false;
  };

  exitFullscreen(): void {
    if (document.fullscreenElement && document.hasFocus()) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }
}
