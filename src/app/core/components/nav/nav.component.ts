import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Router} from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../../../shared/services/user.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public sidenav: MatSidenav;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private router: Router) {}

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

  isLoggedIn(){
    return this.userService.isLoggedIn();
  }

  logout(){
    console.log('inside parent -- log out!');
    this.userService.logout();
    this.router.navigate(['/login']);
  }


}
