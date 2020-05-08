import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndUserComponent } from './end-user.component';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';

const authenticationRoutes: Routes = [
  { 
    path: 'events', 
    component: EndUserComponent,
    canActivate: [LoggedInGuard],
    /*
    children: [
    {
      path: '',
      component: AnalyzeEventComponent,
    },

    ]
    */
  },
];


@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class EndUserRoutingModule { }
