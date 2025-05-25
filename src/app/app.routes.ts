import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ResultsComponent } from './pages/results/results.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { ExamComponent } from './pages/exam/exam.component';
import { ResultComponent } from './pages/result/result.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { AdminManageComponent } from './pages/admin/admin-manage/admin-manage.component';
import { AdminResultsComponent } from './pages/admin/admin-results/admin-results.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'home', canActivate: [authGuard], component: HomeComponent },
    { 
    path: '', 
    redirectTo: '/user/dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'user',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'results', component: ResultsComponent },
       { path: 'results/:id', component: ResultComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'exams/:id', component: ExamComponent },
    ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: AdminComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'manage-exams', component: AdminManageComponent },
      { path: 'tolab-results', component: AdminResultsComponent }
    ]
  },
];
