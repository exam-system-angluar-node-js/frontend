import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { initFlowbite } from 'flowbite';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { LayoutComponent } from "./layout/layout.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RegisterComponent, LoginComponent, DashboardComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
