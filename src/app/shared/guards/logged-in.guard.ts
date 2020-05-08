// logged-in.guard.ts
// see: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.lqhxl5wku
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private user: UserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('params: ', next.params);
      console.log('url: ', state.url);
      if (this.user.isLoggedIn()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
  
}
