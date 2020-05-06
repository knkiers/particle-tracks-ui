import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';

//import { MatCardModule } from '@angular/material/card';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    //MatCardModule,
    AngularMaterialModule
  ],
  exports: [
  ]
})
export class AuthenticationModule { }
