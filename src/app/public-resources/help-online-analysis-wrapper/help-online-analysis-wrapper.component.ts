import { Component, OnInit } from '@angular/core';

import { HelpOnlineAnalysisComponent } from '../../shared/static-content/help-online-analysis/help-online-analysis.component';

@Component({
  selector: 'app-help-online-analysis-wrapper',
  templateUrl: './help-online-analysis-wrapper.component.html',
  styleUrls: ['./help-online-analysis-wrapper.component.scss'],
  entryComponents: [HelpOnlineAnalysisComponent],
})
export class HelpOnlineAnalysisWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
