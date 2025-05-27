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

}
