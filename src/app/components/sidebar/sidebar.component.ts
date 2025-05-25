import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SmcardComponent } from "../../shared/components/smcard/smcard.component";
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [SmcardComponent,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
    queryPath!: string;
    constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    initFlowbite();
    this.queryPath = this.route.snapshot.url[0].path
  }

}
