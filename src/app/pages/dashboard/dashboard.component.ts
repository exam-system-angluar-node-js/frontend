import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CardComponent } from "../../shared/components/card/card.component";
import { PiechartComponent } from "../../components/piechart/piechart.component";
import { SmcardComponent } from "../../shared/components/smcard/smcard.component";
import { BasechartComponent } from "../../components/basechart/basechart.component";

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, NavbarComponent, CardComponent, PiechartComponent, SmcardComponent, BasechartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
