import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FocusModeService } from '../services/focus-mode.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  togglerState: boolean = false
  focusMode: boolean = false;
  constructor(
    private focusModeService: FocusModeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.focusModeService.focusMode$.subscribe(mode => {
      this.focusMode = mode;
      this.cdr.detectChanges();
    });
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
