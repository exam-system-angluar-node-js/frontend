import { Component } from '@angular/core';
import { SmcardComponent } from "../../shared/components/smcard/smcard.component";
import { BasechartComponent } from "../../components/basechart/basechart.component";
import { LgcardComponent } from "../../shared/components/lgcard/lgcard.component";

@Component({
  selector: 'app-results',
  imports: [LgcardComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  results =[{
    id: 1,
    title: 'HTML', 
    completedAgo: '2 hours ago', 
    questionsCount: 15, 
    scoreText: '10/15 (80%)',
    scorePercent: 80
  },
  {
    id: 2,
    title: 'CSS', 
    completedAgo: '3 hours ago', 
    questionsCount: 18, 
    scoreText: '12/18 (70%)',
    scorePercent: 70
  },
  {
    id: 3,
    title: 'JavaScript', 
    completedAgo: '14 hours ago', 
    questionsCount: 20, 
    scoreText: '12/20 (60%)',
    scorePercent: 60
  },
  {
    id: 4,
    title: 'PHP', 
    completedAgo: '10 hours ago', 
    questionsCount: 25, 
    scoreText: '8/25 (40%)',
    scorePercent: 40
  }]
}
