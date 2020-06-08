import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeacherComponent } from './teacher.component';
import { UserEventsByIdComponent } from './user-events-by-id/user-events-by-id.component';


@NgModule({
  declarations: [DashboardComponent, TeacherComponent, UserEventsByIdComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
