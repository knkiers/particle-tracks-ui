import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';

import { PublicResourcesComponent } from './public-resources.component';
import { ParticleDecaysComponent } from './particle-decays/particle-decays.component';
import { ParticlePropertiesComponent} from './particle-properties/particle-properties.component';
import { AnalyzeEventComponent } from './analyze-event/analyze-event.component';
import { HelpOnlineAnalysisWrapperComponent } from './help-online-analysis-wrapper/help-online-analysis-wrapper.component';
import { HelpOfflineAnalysisWrapperComponent } from './help-offline-analysis-wrapper/help-offline-analysis-wrapper.component';
import { TechnicalBackgroundComponent } from './technical-background/technical-background.component';

const publicRoutes: Routes = [
  { 
    path: 'public', 
    component: PublicResourcesComponent,
    children: [
      {
        path: 'particle-decays',
        component: ParticleDecaysComponent
      },
      {
        path: 'particle-properties',
        component: ParticlePropertiesComponent
      },
      {
        path: 'analyze-event',
        component: AnalyzeEventComponent,
        canActivate: [NotLoggedInGuard],
      },
      {
        path: 'help-online-analysis',
        component: HelpOnlineAnalysisWrapperComponent,
      },
      {
        path: 'help-offline-analysis',
        component: HelpOfflineAnalysisWrapperComponent,
      },
      {
        path: 'background',
        component: TechnicalBackgroundComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(publicRoutes)],
  exports: [RouterModule]
})
export class PublicResourcesRoutingModule { }
