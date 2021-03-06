import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {Router} from '@angular/router';

import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  @Input() isLoggedIn: boolean;
  @Input() currentUser: User = null;
  
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() logUserOut = new EventEmitter<void>();


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  manageAccount() {
    this.router.navigate(['/profile']);
  }

  public logout() {
    console.log('log out!');
    this.logUserOut.emit();
    //this.authService.logout(this.returnUrl || '/');
  }

}
