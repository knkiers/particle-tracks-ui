import { Component } from '@angular/core';

//import {EventDisplayService} from './shared/services/event-display.service';
//import {UnitConversionService} from './shared/services/unit-conversion.service';
//import {EventAnalysisService} from './shared/services/event-analysis.service';

//import { CircleBindingService } from './end-user/circle-binding.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    //UserService,
    //EventDisplayService,
    //UnitConversionService,
    //EventAnalysisService,
    //CircleBindingService//,
    //LoggedInGuard
  ]
})
export class AppComponent {
  title = 'particle-tracks-ui';
}
