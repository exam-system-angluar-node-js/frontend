import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() questionsCount: number = 0;
  @Input() usage: string = 'default';
  get isManageMode(): boolean {
    return this.usage.toLowerCase() === 'manage';
  }
}
