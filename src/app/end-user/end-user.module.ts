import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { EndUserRoutingModule } from './end-user-routing.module';
import { EndUserComponent } from './end-user.component';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { AnalysisDisplayComponent } from './analysis-display/analysis-display.component';
import { CircleItemComponent } from './circle-item/circle-item.component';
import { CircleTableComponent } from './circle-table/circle-table.component';
import { MomentumAxisComponent } from './momentum-axis/momentum-axis.component';

@NgModule({
  declarations: [EndUserComponent, AnalysisDisplayComponent, CircleItemComponent, CircleTableComponent, MomentumAxisComponent ],
  imports: [
    CommonModule,
    EndUserRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule
  ],
  exports: []
})
export class EndUserModule { }
