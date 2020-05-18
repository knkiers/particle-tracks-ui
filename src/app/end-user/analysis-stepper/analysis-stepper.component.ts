import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { EventInfoService } from '../event-info.service';

@Component({
  selector: 'app-analysis-stepper',
  templateUrl: './analysis-stepper.component.html',
  styleUrls: ['./analysis-stepper.component.scss']
})
export class AnalysisStepperComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatStepper;

  canSubmit: boolean = false;
  warningsExist: boolean = false;
  errorsExist: boolean = false;

  constructor(private eventInfoService: EventInfoService) { }

  ngOnInit(): void {
  }

  onReviewStatusUpdate(reviewStatus: any) {
    this.canSubmit = reviewStatus.canSubmit;
    this.errorsExist = reviewStatus.errorsExist;
    this.warningsExist = reviewStatus.warningsExist;
  }

  submitEvent() {
    console.log('submit event!');
    this.eventInfoService.announcedEventStagedForSubmit();
    // https://stackoverflow.com/questions/46469233/can-i-programmatically-move-the-steps-of-a-mat-horizontal-stepper-in-angular-a
    this.myStepper.reset();
  }


}
