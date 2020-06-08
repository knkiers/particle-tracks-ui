import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherComponent } from './teacher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserEventsByIdComponent } from './user-events-by-id/user-events-by-id.component';

import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { AdminGuard } from '../shared/guards/admin.guard';

const teacherRoutes: Routes = [
  { 
    path: 'teacher', 
    component: TeacherComponent,
    canActivate: [LoggedInGuard, AdminGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'user-events/:userId',
        component: UserEventsByIdComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(teacherRoutes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
