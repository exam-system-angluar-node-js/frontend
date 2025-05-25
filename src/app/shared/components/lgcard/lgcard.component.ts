import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lgcard',
  imports: [RouterLink],
  templateUrl: './lgcard.component.html',
  styleUrl: './lgcard.component.css'
})
export class LgcardComponent {
  @Input() title: string = '';
  @Input() completedAgo: string = '';
  @Input() questionsCount: number = 0;
  @Input() scoreText: string = '';
}
