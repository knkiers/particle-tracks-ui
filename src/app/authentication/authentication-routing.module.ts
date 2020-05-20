import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


const authenticationRoutes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'signup',
    component: SignupComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
