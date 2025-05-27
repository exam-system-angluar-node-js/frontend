import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @ViewChild('dropdown') dropdown!: ElementRef;
  queryPath!: string;
  isDropdownOpen = false;

  constructor(private route: ActivatedRoute) {}

  @Input() isSidebarOpen = false;
  @Output() toggleState = new EventEmitter<boolean>();

  onToggle() {
    this.toggleState.emit(!this.isSidebarOpen);
  }

  ngOnInit(): void {
    this.queryPath = this.route.snapshot.url[0].path;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.dropdown.nativeElement.classList.remove('hidden');
      this.dropdown.nativeElement.classList.add('block');
    } else {
      this.dropdown.nativeElement.classList.add('hidden');
      this.dropdown.nativeElement.classList.remove('block');
    }
  }

  onRouting(): void {
    this.isDropdownOpen = false;
    this.dropdown.nativeElement.classList.add('hidden');
    this.dropdown.nativeElement.classList.remove('block');
  }
}