import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { MatStepper } from '@angular/material/stepper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EventInfoService } from '../event-info.service';

import { DeactivationGuarded } from '../../shared/guards/can-deactivate.guard';

@Component({
  selector: 'app-analysis-stepper',
  templateUrl: './analysis-stepper.component.html',
  styleUrls: ['./analysis-stepper.component.scss']
})
export class AnalysisStepperComponent implements OnInit, OnDestroy, DeactivationGuarded {

  @ViewChild('stepper') private myStepper: MatStepper;

  resetReviewDataSubscription: Subscription;

  canSubmit: boolean = false;
  warningsExist: boolean = false;
  errorsExist: boolean = false;
  allowNavigation: boolean = true;

  constructor(
    private eventInfoService: EventInfoService,
    public dialog: MatDialog) { }

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

  onAnalysisStatusUpdate(analysisStatus: any){
    console.log('analysis status update received!  Allow navigation? ', analysisStatus.allowNavigation);
    this.allowNavigation = analysisStatus.allowNavigation;
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

  openDialog(): void {
    console.log('about to open dialog!');
    const dialogRef = this.dialog.open(NavigateAwayDialog, {
      width: '60%',
      data: { text: 'The event you are analyzing has not yet been submitted.  Your work has been saved, so you can return to finish and submit it later.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


  //https://medium.com/@tobias.ljungstrom/how-to-use-a-custom-dialogue-with-the-candeactivate-route-guard-in-angular-385616470b6a
  canDeactivate(): Observable<boolean> | boolean {
    console.log('can deactivate has fired in the component!');
    if (this.allowNavigation) {
      return true;
    } else {
      this.openDialog();
      return this.eventInfoService.navigateAwaySelection$;
    }
  }

  ngOnDestroy() {
    this.resetReviewDataSubscription.unsubscribe();
  }

}

export interface DialogData {
  text: string;
}

@Component({
  selector: 'navigate-away-dialog',
  templateUrl: 'navigate-away-dialog.html',
})
export class NavigateAwayDialog {

  constructor(
    private eventInfoService: EventInfoService,
    public dialogRef: MatDialogRef<NavigateAwayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  choose(choice: boolean): void {
    this.eventInfoService.navigateAwaySelection$.next(choice);
    this.dialogRef.close();
  }

}
