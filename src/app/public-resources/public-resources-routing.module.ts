import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotLoggedInGuard } from '../shared/guards/not-logged-in.guard';

import { PublicResourcesComponent } from './public-resources.component';
import { ParticleDecaysComponent } from './particle-decays/particle-decays.component';
import { ParticlePropertiesComponent} from './particle-properties/particle-properties.component';
import { AnalyzeEventComponent } from './analyze-event/analyze-event.component';
import { HelpOnlineAnalysisWrapperComponent } from './help-online-analysis-wrapper/help-online-analysis-wrapper.component';

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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(publicRoutes)],
  exports: [RouterModule]
})
export class PublicResourcesRoutingModule { }
