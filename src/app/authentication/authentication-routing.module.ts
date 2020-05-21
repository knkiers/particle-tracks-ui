import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';

const authenticationRoutes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'reset-password-confirm',
    component: ResetPasswordConfirmComponent,
    canActivate: [NotLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
