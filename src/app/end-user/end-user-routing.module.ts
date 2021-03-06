import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndUserComponent } from './end-user.component';
//import { AnalysisDisplayComponent } from './analysis-display/analysis-display.component';
import { AnalysisStepperComponent } from './analysis-stepper/analysis-stepper.component';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate.guard';
//import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';

const authenticationRoutes: Routes = [
  { 
    path: 'events', 
    component: EndUserComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: AnalysisStepperComponent,
        canDeactivate: [CanDeactivateGuard],
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class EndUserRoutingModule { }
