import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
// deprecated: import { Http, Headers } from '@angular/http';
// Angular 8/9: https://www.positronx.io/angular-8-httpclient-http-tutorial-build-consume-restful-api/

// See: https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450
// Note: at some point Http will be deprecated in favour of HttpClient....
// See: https://angular.io/guide/http
//import {HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable, Subject, pipe, ObservableInput } from 'rxjs';
//import { map } from 'rxjs/operators';
import { tap, retry, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpService } from './http.service';

// NOTE: only using angular2-jwt to decode the jwt; in principle this package could
//       be used much more extensively

//import localStorage from 'localStorage';

// useful authentication resource:
// https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.swnprx2cf

import { EventTypeUrl } from './urls';
import { LoginUrl } from './urls';
import { AccountsUrl } from './urls';
import { UsersUrl } from './urls';
import { UsersThisInstitutionUrl } from './urls';
import { InstitutionsUrl } from './urls';
import { ResetPasswordUrl } from './urls';
import { ResetPasswordConfirmUrl } from './urls';

import { User } from '../models/user';
import { Institution } from '../interfaces/institution';
import { UserNumberEvents } from '../interfaces/user-number-events';
import { UpdateUserData, UpdateUserDataResponse } from '../interfaces/update-user-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  jwtHelper = new JwtHelperService();

  currentUser: User = null;

  // Observable user source
  private userAnnouncedSource = new Subject<User>();

  // Observable user stream
  userAnnounced$ = this.userAnnouncedSource.asObservable();

  constructor(
    private httpService: HttpService,
    private http: HttpClient,
    private router: Router
  ) { }

  register(username, password, email, firstName, lastName, institutionId): Observable<any> {
    
    let httpOptions = this.httpService.buildHttpOptions();
    let emptyList = [];

    return this.http
      .post(
        AccountsUrl,
        JSON.stringify({
          'username': username,
          'password': password,
          'email': email,
          'first_name': firstName,
          'last_name': lastName,
          'analyzed_events': emptyList,
          'institution_id': institutionId
        }),
        httpOptions
      )
      .pipe(
        retry(1),
        tap(res => {
          console.log('here is what we got back: ', res, typeof res);
        }),
        catchError(this.httpService.createAccountErrorHandler)
      );
  }

  update(updateUserData: UpdateUserData, userId: number): Observable<UpdateUserDataResponse> {
    console.log('update user data: ', updateUserData);
    console.log('user id: ', userId);

    let authToken = sessionStorage.getItem('auth_token');
    console.log('auth token: ', authToken);
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);
  
    let emptyList = [];

    return this.http
      .put<UpdateUserDataResponse>(
        AccountsUrl + userId + '/',
        JSON.stringify(updateUserData),
        httpOptions
      )
      .pipe(
        tap((response: UpdateUserDataResponse) => {
          // apparently if there is an error, that just gets returned automatically(?), skipping over this part of the code
          //let jsonResponse = res.json();
          console.log('updated user! ', response);
          sessionStorage.setItem('auth_token', response.token);
          //this.loggedIn = true;
          //return jsonResponse;
        }),
        catchError(this.httpService.createAccountErrorHandler)
      );
  }



  /* example from: https://www.positronx.io/angular-8-httpclient-http-tutorial-build-consume-restful-api/
  CreateBug(data): Observable<Bug> {
    return this.http.post<Bug>(this.baseurl + '/bugtracking/', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }  
  */

  // example from: https://www.positronx.io/angular-8-httpclient-http-tutorial-build-consume-restful-api/
  login(username: string, password: string): Observable<any> {
    console.log('inside service: ', username, password);
    let httpOptions = this.httpService.buildHttpOptions();
    return this.http.post<any>(LoginUrl, JSON.stringify({ username, password }), httpOptions)
      .pipe(
        retry(5),
        tap(res => {
          console.log('here is what we got back: ', res, typeof res);
          sessionStorage.setItem('auth_token', res.token);
        }),
        catchError(this.httpService.loginErrorHandler)
      )
  }

  resetPassword(email: string) {
    let httpOptions = this.httpService.buildHttpOptions();
    return this.http
      .post(
        ResetPasswordUrl,
        JSON.stringify({ 'email': email }),
        httpOptions)
      .pipe(
        tap(res => {
          console.log('here is what we got back: ', res, typeof res);
        }),
        catchError(this.httpService.resetPasswordErrorHandler)
      );
  }

  /*
  resetPasswordConfirm(token: string, password: string) {
    console.log('password: ', password);
    console.log('token: ', token);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post(
        ResetPasswordConfirmUrl,
        JSON.stringify({ 'token': token, 'password': password }),
        { headers })
      .pipe(
        map(res => {
          // apparently if there is an error, that just gets returned automatically(?), skipping over this part of the code
          let jsonResponse = res.json();
          console.log(jsonResponse);
          //this.loggedIn = true;
          return jsonResponse;
        })
      );
  }
  */

  tokenExpired() {
    let token: string = this.fetchToken();
    if (token === null) {
      return true;
    } else {
      let nowSeconds = Date.now() / 1000;
      let decoded = this.jwtHelper.decodeToken(token);

      return !(decoded.exp > nowSeconds + 10);// add 10 seconds to be on the safe side
    }
  }


  setUserData(authToken: string): Observable<any> {
    let decoded = this.jwtHelper.decodeToken(authToken);//localStorage.getItem('auth_token'));
    let userID = decoded.user_id;
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    // some useful information about map, etc.:
    // https://stackoverflow.com/questions/40029986/how-does-map-subscribe-on-angular2-work
    return this.http.get<User>(
      UsersUrl + userID + "/",
      httpOptions
    )
      .pipe(
        retry(5),
        tap(userData => {
          console.log('here is what we got back: ', userData, typeof userData);
          this.currentUser = new User(userData);
          //console.log('user data: ', userData);
          this.announceUser(this.currentUser);
          return userData;
          //sessionStorage.setItem('auth_token', res.token);
        }),
        catchError(this.httpService.errorHandler)
      );
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    //this.loggedIn = false;
    this.userAnnouncedSource.next(null);
    //this.announceLogOut();
  }

  fetchToken() {
    return sessionStorage.getItem('auth_token');
  }

  isLoggedIn() {
    let loggedIn: boolean = !!sessionStorage.getItem('auth_token');
    return loggedIn;
  }

  isAdmin() {
    if (this.currentUser === null) {
      return false;
    } else {
      return this.currentUser.isStaff;
    }
  }


  currentUserDataIsSet() {
    return !(this.currentUser === null);
  }

  fetchCurrentUser() {
    if (this.currentUserDataIsSet()) {
      return this.currentUser;
    } else {
      return null;
    }
  }

  fetchUsers(): Observable<any> {

    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/

    //https://stackoverflow.com/questions/45286764/angular-httpclient-doesnt-send-header

    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    return this.http.get<any>(
      UsersUrl,
      httpOptions
    )
      .pipe(
        tap(users => {
          console.log('users: ', users);
          return users;
        }),
        catchError(this.httpService.errorHandler)
      );
  }

  fetchUsersThisInstitution(): Observable<any> {
    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/

    // https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450

    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    //eventually will be required to switch to HttpClient; then this will be how to set the headers:
    //let headers = new HttpHeaders(); // this is the
    //headers = headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${authToken}`);

    //console.log(headers);

    return this.http
      .get(
        UsersThisInstitutionUrl,
        httpOptions
      )
      .pipe(
        tap(users => {
          console.log('users: ', users);
          return users;
        }),
        catchError(this.httpService.errorHandler)
      );
  }


  /*
  fetchUser(userId: number) {

    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/
    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);
    return this.http
      .get(
        UsersUrl + userId + '/',
        { headers }
      )
      .pipe(
        map(res => res.json())
      );
  }
  */


  // Service message command
  announceUser(user: User) {
    this.userAnnouncedSource.next(user);
  }

  fetchInstitutions() {
    let httpOptions = this.httpService.buildHttpOptions();
    return this.http
      .get<Institution[]>(
        InstitutionsUrl,
        httpOptions
      )
      .pipe(
        tap((institutions: Institution[]) => {
          console.log('institutions: ', institutions);
          //return institutions;
        }),
        catchError(this.httpService.errorHandler)
      );
  }


}
