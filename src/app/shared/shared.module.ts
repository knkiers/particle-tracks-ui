import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';

import { RoundRealPipe } from './pipes/round-real.pipe';
import { ChargedDecaysComponent } from './static-content/charged-decays/charged-decays.component';
import { ParticleTooltipComponent } from './static-content/particle-tooltip/particle-tooltip.component';
import { NeutralDecaysComponent } from './static-content/neutral-decays/neutral-decays.component';
import { HelpOnlineAnalysisComponent } from './static-content/help-online-analysis/help-online-analysis.component';
import { CcwIconComponent } from './static-content/ccw-icon/ccw-icon.component';
import { CwIconComponent } from './static-content/cw-icon/cw-icon.component';


@NgModule({
  declarations: [RoundRealPipe, ChargedDecaysComponent, ParticleTooltipComponent, NeutralDecaysComponent, HelpOnlineAnalysisComponent, CcwIconComponent, CwIconComponent],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [CommonModule, RoundRealPipe, ChargedDecaysComponent, NeutralDecaysComponent, HelpOnlineAnalysisComponent, CcwIconComponent, CwIconComponent]
})
export class SharedModule { }
