import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { UserService } from '../../../shared/services/user.service';
import { SnackBarInfoService } from '../../../shared/services/snack-bar-info.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class NavComponent implements OnInit, OnDestroy{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public sidenav: MatSidenav;
  unsubmitWarningSubscription: Subscription;
  eventSubmittedSubscription: Subscription;
  snackBarsDismissedSubscription: Subscription;

  unsubmitWarningSnackBarRef: MatSnackBarRef<any> = null;
  unsubmitWarningSnackBarDismissed: boolean = false;

  eventSubmittedSnackBarRef: MatSnackBarRef<any> = null;
  eventSubmittedSnackBarDismissed: boolean = false;

  teacherNavExpanded: boolean = true;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    snackBarInfoService: SnackBarInfoService,
    private _snackBar: MatSnackBar,
    private router: Router) {
      this.unsubmitWarningSubscription = snackBarInfoService.unsubmitWarningSnackBarLaunched$.subscribe(
        () => this.launchUnsubmitWarningSnackBar()
      );
      this.eventSubmittedSubscription = snackBarInfoService.eventSubmittedSnackBarLaunched$.subscribe(
        () => this.launchEventSubmittedSnackBar()
      );
      this.snackBarsDismissedSubscription = snackBarInfoService.snackBarsDismissed$.subscribe(
        () => this.dismissAllSnackBars()
      );
    }

  currentUser: User = null;

  ngOnInit() {
    // grab current user info if it exists....
    if (this.userService.isLoggedIn()){
      //this.currentUser = this.userService.getCurrentUser();
      console.log('inside ngOnInit, and the user is logged in already');
      // make sure we haven't lost the user's information for some reason; if so, refetch it....
      if (!this.userService.currentUserDataIsSet()) {
        let token = this.userService.fetchToken();
        if (token !== null && !(this.userService.tokenExpired())) {
          this.userService.setUserData(token).subscribe(
            (user: User) => {
              console.log('user is logged in and ready to go', user);
              this.currentUser = user;
            }
          )
        }


      }
    } else {
      console.log('inside ngOnInit, and the user is not logged in yet');
      //console.log(this.currentUser);
    }
    // ...and sign up for the service in order to keep up with changes
    this.userService.userAnnounced$.subscribe(
      (user: User) => {
        this.currentUser = user;
        console.log('inside app comp...user updated', user);
//        console.log(this.currentUser);
      });
    /*
     if(this.isLoggedIn()) {
     //this.currentUserName = this.user.currentUser.fullName();
     console.log()
     }
     */
  }

  teacherNavToggle() {
    this.teacherNavExpanded = !this.teacherNavExpanded;
  }

  launchUnsubmitWarningSnackBar(): void {
    this.unsubmitWarningSnackBarRef = this._snackBar.open(
      'This event has already been submitted.  Editing the analysis will cause it to become unsubmitted, and you will need to resubmit it.',
      'OK');
    this.unsubmitWarningSnackBarDismissed = false;
    this.unsubmitWarningSnackBarRef.afterDismissed().subscribe(() => {
      console.log('The snack-bar was dismissed');
      console.log('dismissed flag: ', this.unsubmitWarningSnackBarDismissed);
      this.unsubmitWarningSnackBarDismissed = true;
      console.log('dismissed flag: ', this.unsubmitWarningSnackBarDismissed);
    });
  }

  launchEventSubmittedSnackBar(): void {
    this.eventSubmittedSnackBarRef = this._snackBar.open('Event submitted successfully!  The next stage of your analysis is offline. You can access your submitted events via the side navigation menu.', 'OK');
    this.eventSubmittedSnackBarDismissed = false;
    this.eventSubmittedSnackBarRef.afterDismissed().subscribe(() => {
      console.log('The snack-bar was dismissed');
      // the following is used in the OnDestroy method to decide whether or not to dismiss the snackbar...probably not the best way to do this
      this.eventSubmittedSnackBarDismissed = true;
    });
  }
  
  isLoggedIn(){
    return this.userService.isLoggedIn();
  }

  isAdmin() {
    return this.userService.isAdmin();
  }

  logout(){
    console.log('inside parent -- log out!');
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  dismissAllSnackBars() {
    if (this.unsubmitWarningSnackBarRef !== null) {
      if (!this.unsubmitWarningSnackBarDismissed) {
        console.log('...snack bar not yet dismissed!  doing so now....');
        this.unsubmitWarningSnackBarRef.dismiss();
      }
    }
    if (this.eventSubmittedSnackBarRef !== null) {
      console.log('event submitted snack bar ref exists! ', this.eventSubmittedSnackBarRef);
      if (!this.eventSubmittedSnackBarDismissed) {
        console.log('...snack bar not yet dismissed!  doing so now....');
        this.eventSubmittedSnackBarRef.dismiss();
      }
    }
  }

  ngOnDestroy() {
    this.unsubmitWarningSubscription.unsubscribe();
    console.log('leaving the page!!!!!');
    this.dismissAllSnackBars();
  }


}
