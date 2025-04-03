import { Routes, CanActivateFn, Router } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { StudentComponent } from './Pages/student/student.component';
import { StudentInfoComponent } from './Pages/student-info/student-info.component';
import { DataProcessingComponent } from './Pages/data-processing/data-processing.component';
import { DataGenerationComponent } from './Pages/data-generation/data-generation.component';

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'student',
        component: StudentComponent,
        canActivate: [authGuard],
      },
      {
        path: 'student/:studentId',
        component: StudentInfoComponent,
        canActivate: [authGuard],
      },
      {
        path: 'data-processing',
        component: DataProcessingComponent,
        canActivate: [authGuard],
      },
      {
        path: 'data-generation',
        component: DataGenerationComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
