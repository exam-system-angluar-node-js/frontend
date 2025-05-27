import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [ RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();
  queryPath!: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.queryPath = this.route.snapshot.url[0].path;
  }
}
