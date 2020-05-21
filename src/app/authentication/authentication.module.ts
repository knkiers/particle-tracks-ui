import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';

//import { MatCardModule } from '@angular/material/card';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ProfileComponent, ResetPasswordComponent, ResetPasswordConfirmComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class AuthenticationModule { }
