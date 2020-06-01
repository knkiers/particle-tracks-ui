import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * this service is used for relaying information to a top-level component that a snackbar should be opened;
 * this is being managed at a top level so that we can deal with dismissing snackbars when the user navigates
 * between differen pages within the app, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class SnackBarInfoService {

  constructor() { }

  // Observable sources
  private unsubmitWarningSnackBarSource = new Subject<void>();
  private eventSubmittedSnackBarSource = new Subject<void>();
  private dismissSnackBarsSource = new Subject<void>();
  
  // Observable streams
  unsubmitWarningSnackBarLaunched$ = this.unsubmitWarningSnackBarSource.asObservable();
  eventSubmittedSnackBarLaunched$ = this.eventSubmittedSnackBarSource.asObservable();
  snackBarsDismissed$ = this.dismissSnackBarsSource.asObservable();

  announceUnsubmitWarningSnackBar() {
    console.log('snackbar message emitted!');
    this.unsubmitWarningSnackBarSource.next();
  }

  announceEventSubmittedSnackBar() {
    this.eventSubmittedSnackBarSource.next();
  }

  announceSnackBarsDismissed() {
    this.dismissSnackBarsSource.next();
  }

}
