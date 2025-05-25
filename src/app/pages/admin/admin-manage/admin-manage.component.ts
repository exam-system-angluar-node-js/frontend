import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';




@Component({
  selector: 'app-admin-manage',
  imports: [CardComponent, SidebarComponent, NavbarComponent],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css'
})
export class AdminManageComponent {

  exams = [
    {
      id: 1,
      title: 'Exam 1',
      description: 'Description of exam 1',
      image: 'html.jpg',
      questionsCount: 55,
    },
    {
      id: 2,
      title: 'Exam 2',
      description: 'Description of exam 2',
      image: 'js.jpg',
      questionsCount: 55,
    },
    {
      id: 3,
      title: 'Exam 3',
      description: 'Description of exam 3',
      image: 'cs.jpg',
      questionsCount: 55,
    },
    {
      id: 4,
      title: 'Exam 4',
      description: 'Description of exam 4',
      image: 'html.jpg',
      questionsCount: 55,
    },
    {
      id: 5,
      title: 'Exam 5',
      description: 'Description of exam 5',
      image: 'js.jpg',
      questionsCount: 55,
    },
    {
      id: 6,
      title: 'Exam 6',
      description: 'Description of exam 6',
      image: 'cs.jpg',
      questionsCount: 55,
    },
  ];
}
