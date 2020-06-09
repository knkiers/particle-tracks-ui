import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeacherComponent } from './teacher.component';
import { UserEventsByIdComponent } from './user-events-by-id/user-events-by-id.component';
import { EventInfoAnchorDirective } from './user-events-by-id/event-info-anchor.directive';
import { UserEventWrapperAnchorDirective } from './user-events-by-id/user-event-wrapper-anchor.directive';
import { EventEnergyMomentumComponent } from './event-energy-momentum/event-energy-momentum.component';
import { AnalysisDisplayWrapperComponent } from './analysis-display-wrapper/analysis-display-wrapper.component';
import { UserEventAnchorDirective } from './analysis-display-wrapper/user-event-anchor.directive';


@NgModule({
  declarations: [DashboardComponent, TeacherComponent, UserEventsByIdComponent, EventInfoAnchorDirective, UserEventWrapperAnchorDirective, EventEnergyMomentumComponent, AnalysisDisplayWrapperComponent, UserEventAnchorDirective],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }