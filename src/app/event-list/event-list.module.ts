import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { EventListRoutingModule } from './event-list-routing.module';
import { UserEventsComponent } from './user-events/user-events.component';


@NgModule({
  declarations: [UserEventsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    EventListRoutingModule
  ]
})
export class EventListModule { }
