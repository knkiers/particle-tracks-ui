import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndUserComponent } from './end-user.component';

const authenticationRoutes: Routes = [
  { path: 'events', component: EndUserComponent },
];
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class EndUserRoutingModule { }
