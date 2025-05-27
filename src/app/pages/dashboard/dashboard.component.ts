import { Component } from '@angular/core';
import { SmcardComponent } from "../../shared/components/smcard/smcard.component";
import { BasechartComponent } from "../../components/basechart/basechart.component";

@Component({
  selector: 'app-dashboard',
  imports: [ SmcardComponent, BasechartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
