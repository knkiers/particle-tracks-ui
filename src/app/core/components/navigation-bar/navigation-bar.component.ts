import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  @Input() isLoggedIn: boolean;
  
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() logUserOut = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  public logout() {
    console.log('log out!');
    this.logUserOut.emit();
    //this.authService.logout(this.returnUrl || '/');
  }

}
