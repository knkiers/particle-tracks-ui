import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { MatStepper } from '@angular/material/stepper';

import { EventInfoService } from '../event-info.service';

@Component({
  selector: 'app-analysis-stepper',
  templateUrl: './analysis-stepper.component.html',
  styleUrls: ['./analysis-stepper.component.scss']
})
export class AnalysisStepperComponent implements OnInit, OnDestroy {

  @ViewChild('stepper') private myStepper: MatStepper;

  resetReviewDataSubscription: Subscription;

  canSubmit: boolean = false;
  warningsExist: boolean = false;
  errorsExist: boolean = false;

  constructor(private eventInfoService: EventInfoService) { }

  ngOnInit(): void {
    console.log('myStepper: ', this.myStepper);
    this.resetReviewDataSubscription = this.eventInfoService.reviewDataCleared$.subscribe(
      () => {
        console.log('received reset command!');
        this.resetStepper();
      });
  }

  onReviewStatusUpdate(reviewStatus: any) {
    this.canSubmit = reviewStatus.canSubmit;
    this.errorsExist = reviewStatus.errorsExist;
    this.warningsExist = reviewStatus.warningsExist;
    console.log('myStepper: ', this.myStepper);
  }

  resetStepper() {
    this.canSubmit = false;
    this.warningsExist = false;
    this.errorsExist = false;
    this.myStepper.reset();
  }

  submitEvent() {
    console.log('submit event!');
    this.eventInfoService.announcedEventStagedForSubmit();
    // https://stackoverflow.com/questions/46469233/can-i-programmatically-move-the-steps-of-a-mat-horizontal-stepper-in-angular-a
    this.myStepper.reset();
  }

  ngOnDestroy() {
    this.resetReviewDataSubscription.unsubscribe();
  }

}
