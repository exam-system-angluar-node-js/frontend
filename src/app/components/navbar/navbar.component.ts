import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen: boolean = false;
  @Output() toggleState = new EventEmitter<boolean>()

  onToggle() {
    this.isOpen = !this.isOpen
    this.toggleState.emit(this.isOpen)
  }
}
