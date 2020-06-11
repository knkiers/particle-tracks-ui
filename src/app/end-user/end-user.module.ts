import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';

import { EndUserRoutingModule } from './end-user-routing.module';
import { EndUserComponent } from './end-user.component';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { AnalysisDisplayComponent, CannotFitCircleDialog, EventNowUnsubmittedDialog } from './analysis-display/analysis-display.component';
import { CircleItemComponent } from './circle-item/circle-item.component';
import { CircleTableComponent } from './circle-table/circle-table.component';
import { MomentumAxisComponent } from './momentum-axis/momentum-axis.component';
import { AnalysisStepperComponent, NavigateAwayDialog } from './analysis-stepper/analysis-stepper.component';
import { ReviewEventComponent } from './review-event/review-event.component';

@NgModule({
  declarations: [EndUserComponent, AnalysisDisplayComponent, CircleItemComponent, CircleTableComponent, MomentumAxisComponent, AnalysisStepperComponent, NavigateAwayDialog, CannotFitCircleDialog, EventNowUnsubmittedDialog, ReviewEventComponent],
  imports: [
    CommonModule,
    EndUserRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule,
    SharedModule
  ],
  exports: [MomentumAxisComponent, CircleTableComponent, AnalysisDisplayComponent, ReviewEventComponent]
})
export class EndUserModule { }
