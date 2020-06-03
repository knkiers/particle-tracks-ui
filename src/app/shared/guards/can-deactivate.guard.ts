// https://medium.com/@tobias.ljungstrom/how-to-use-a-custom-dialogue-with-the-candeactivate-route-guard-in-angular-385616470b6a
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface DeactivationGuarded {
  canDeactivate(): Observable<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {
  canDeactivate(
    component: DeactivationGuarded,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
  
}
