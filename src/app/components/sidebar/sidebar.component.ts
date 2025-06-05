import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() userDetails: any
  @Input() logoutFunction!: () => void;
  @Output() closeSidebar = new EventEmitter<void>();
  queryPath!: string;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }
  @Input() examLength: any

  ngOnInit(): void {
    this.queryPath = this.route.snapshot.url[0].path;
    this.user = this.authService.currentUserValue;
    this.authService.isLoggedInObservable().subscribe(() => {
      this.user = this.authService.currentUserValue;
    });
  }

  handleLogout() {
    this.logoutFunction();
  }

  getAvatarUrl(): string {
    if (this.user && this.user.avatar) {
      if (this.user.avatar.startsWith('http')) {
        return this.user.avatar;
      }
      return 'http://localhost:3000' + this.user.avatar;
    }
    // fallback image
    return 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
  }
}
