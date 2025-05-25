import { Component } from '@angular/core';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  togglerState:boolean=false
  onToggleState(state: boolean) {
    this.togglerState = state
    console.log(this.togglerState)
  }
}
