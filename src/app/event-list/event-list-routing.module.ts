import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEventsComponent } from './user-events/user-events.component';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';


const routes: Routes = [
  {
    path: 'event-list', // this gets the currently logged in user's events; if user is an admin...diff path but same component, and then include userId as a param?
    component: UserEventsComponent,
    canActivate: [LoggedInGuard]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventListRoutingModule { }
