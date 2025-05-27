import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam',
  imports: [CardComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css'
})
export class ExamComponent implements OnInit,OnDestroy {
  exams!: any[]
  filterdExam!: any
  dataSubscription!: Subscription
  path!:string|null
  constructor(private dataService: DataService, private route:ActivatedRoute) { }
  ngOnInit(): void {
    this.path = this.route.snapshot.paramMap.get('id');
    this.dataSubscription = this.dataService.currentData.subscribe(exams => {
      this.exams = exams;
      console.log(this.exams)
      this.filterdExam = this.exams.find((exam) => exam.id == this.path);
    });
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
 