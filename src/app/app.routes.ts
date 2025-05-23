import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ResultsComponent } from './pages/results/results.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'home', canActivate: [authGuard], component: HomeComponent },
];
