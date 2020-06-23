import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';

import { RoundRealPipe } from './pipes/round-real.pipe';
import { ChargedDecaysComponent } from './static-content/charged-decays/charged-decays.component';
import { ParticleTooltipComponent } from './static-content/particle-tooltip/particle-tooltip.component';
import { NeutralDecaysComponent } from './static-content/neutral-decays/neutral-decays.component';
import { HelpOnlineAnalysisComponent, HelpOfflineAnalysisComponent } from './static-content/help-analysis/help-analysis.component';
import { CcwIconComponent } from './static-content/ccw-icon/ccw-icon.component';
import { CwIconComponent } from './static-content/cw-icon/cw-icon.component';

import { KatexModule } from 'ng-katex';

@NgModule({
  declarations: [
    RoundRealPipe, 
    ChargedDecaysComponent, 
    ParticleTooltipComponent, 
    NeutralDecaysComponent, 
    HelpOnlineAnalysisComponent, 
    HelpOfflineAnalysisComponent, 
    CcwIconComponent, 
    CwIconComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    KatexModule
  ],
  exports: [
    CommonModule, 
    KatexModule,
    RoundRealPipe, 
    ChargedDecaysComponent, 
    NeutralDecaysComponent, 
    HelpOnlineAnalysisComponent, 
    HelpOfflineAnalysisComponent, 
    CcwIconComponent, 
    CwIconComponent]
})
export class SharedModule { }
