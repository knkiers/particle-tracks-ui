import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { EndUserRoutingModule } from './end-user-routing.module';
import { EndUserComponent } from './end-user.component';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';

@NgModule({
  declarations: [EndUserComponent],
  imports: [
    CommonModule,
    EndUserRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule
  ]
})
export class EndUserModule { }
