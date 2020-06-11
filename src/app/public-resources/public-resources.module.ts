import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { PublicResourcesRoutingModule } from './public-resources-routing.module';
import { PublicResourcesComponent } from './public-resources.component';
import { ParticleDecaysComponent } from './particle-decays/particle-decays.component';
import { ParticlePropertiesComponent } from './particle-properties/particle-properties.component';
import { AnalyzeEventComponent } from './analyze-event/analyze-event.component';
import { EndUserModule } from '../end-user/end-user.module';

@NgModule({
  declarations: [PublicResourcesComponent, ParticleDecaysComponent, ParticlePropertiesComponent, AnalyzeEventComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    SharedModule,
    PublicResourcesRoutingModule,
    EndUserModule
  ]
})
export class PublicResourcesModule { }
