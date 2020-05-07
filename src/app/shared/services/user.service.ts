import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// deprecated: import { Http, Headers } from '@angular/http';
// Angular 8/9: https://www.positronx.io/angular-8-httpclient-http-tutorial-build-consume-restful-api/

// See: https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450
// Note: at some point Http will be deprecated in favour of HttpClient....
// See: https://angular.io/guide/http
//import {HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable, Subject, pipe, ObservableInput } from 'rxjs';
//import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

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
import { UserNumberEvents } from '../interfaces/user-number-events';
import { UpdateUserData } from '../interfaces/update-user-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  //jwtHelper: JwtHelper = new JwtHelper();

  jwtHelper = new JwtHelperService();

  currentUser: User = null;

  //private loggedIn = false;

  // Observable user source
  private userAnnouncedSource = new Subject<User>();

  // Observable user stream
  userAnnounced$ = this.userAnnouncedSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Http Headers
  buildHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  buildHttpOptionsSecure(token: string) {
    return {
      headers: new HttpHeaders({
        'Authorization': `JWT ${token}`,//'Bearer ' +token,
        'Content-Type':'application/json'
      })
    };
  }

  /*
  register(username, password, email, firstName, lastName, institutionId): Observable<any> {
    let headers = new Headers();
    let emptyList = [];
    headers.append('Content-Type', 'application/json');

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
        { headers }
      )
      .pipe(
        map(res => res)//.json())
      );
  }
  */

  /*
  update(updateUserData: UpdateUserData, userId: number): Observable<any> {

    console.log('update user data: ', updateUserData);
    console.log('user id: ', userId);

    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');
    //headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    let emptyList = [];
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(
        AccountsUrl + userId + '/',
        JSON.stringify(updateUserData),
        { headers }
      )
      .pipe(
        map(res => {
          // apparently if there is an error, that just gets returned automatically(?), skipping over this part of the code
          let jsonResponse = res.json();
          sessionStorage.setItem('auth_token', jsonResponse.token);
          //this.loggedIn = true;
          return jsonResponse;
        })
      );
  }
  */


  /* example from: https://www.positronx.io/angular-8-httpclient-http-tutorial-build-consume-restful-api/
  CreateBug(data): Observable<Bug> {
    return this.http.post<Bug>(this.baseurl + '/bugtracking/', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }  
  */

  login(username: string, password: string): Observable<any> {
    console.log('inside service: ', username, password);
    let httpOptions = this.buildHttpOptions();
    return this.http.post<any>(LoginUrl, JSON.stringify({ username, password }), httpOptions)
      .pipe(
      retry(5),
      tap(res => {
        console.log('here is what we got back: ',res);
        sessionStorage.setItem('auth_token', res.token);
      }),
      catchError(this.loginErrorHandler)
    )
  }  

  // https://www.techiediaries.com/angular/angular-9-8-tutorial-by-example-rest-crud-apis-http-get-requests-with-httpclient/
  // https://developer.okta.com/blog/2020/01/21/angular-material-login
  loginErrorHandler(error: HttpErrorResponse) {
    console.log('inside error handler ');
    let errorMessage = 'Sorry, there was an unknown error.  Please contact the site administrator if the problem persists.';
    let errorMessageForConsole = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      console.log('client side error');
      errorMessageForConsole = `Error: ${error.error.message}`;
      console.log(errorMessageForConsole);
    } else {
      // Server-side errors
      console.log('server side error');
      errorMessageForConsole = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if ((error.status === 400) || (error.status === 401)) {
        errorMessage = 'Username and password were not recognized.'
      }
    }
    console.log(errorMessageForConsole);
    return throwError(errorMessage);
  }


  /*
  resetPassword(email: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post(
        ResetPasswordUrl,
        JSON.stringify({ 'email': email }),
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
    let httpOptions = this.buildHttpOptionsSecure(authToken);
    
    // some useful information about map, etc.:
    // https://stackoverflow.com/questions/40029986/how-does-map-subscribe-on-angular2-work
    return this.http.get<any>(
      UsersUrl + userID + "/",
      httpOptions
    )
    .pipe(
      retry(5),
      tap(userData => {
        console.log('here is what we got back: ',userData);
        this.currentUser = new User(userData);
        //console.log('user data: ', userData);
        this.announceUser(this.currentUser);
        return userData;
        //sessionStorage.setItem('auth_token', res.token);
      }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: HttpErrorResponse) {
    console.log('inside error handler ');
    let errorMessage = 'Sorry, there was an unknown error.  Please contact the site administrator if the problem persists.';
    let errorMessageForConsole = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      console.log('client side error');
      errorMessageForConsole = `Error: ${error.error.message}`;
      console.log(errorMessageForConsole);
    } else {
      // Server-side errors
      console.log('server side error');
      errorMessageForConsole = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if ((error.status === 400) || (error.status === 401)) {
        errorMessage = 'Username and password were not recognized.'
      }
    }
    console.log(errorMessageForConsole);
    return throwError(errorMessage);
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

  /*
  fetchUsers() {

    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/

    //https://stackoverflow.com/questions/45286764/angular-httpclient-doesnt-send-header

    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    //eventually will be required to switch to HttpClient; then this will be how to set the headers:
    //let headers = new HttpHeaders(); // this is the
    //headers = headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${authToken}`);

    return this.http
      .get(
        UsersUrl,
        { headers }
      )
      .pipe(
        map(res => res.json())
      );
  }

  fetchUsersThisInstitution() {
    if (this.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // the following docs are very helpful for wiring up the authentication with a
    // jwt on both the server and client side:
    //   client side: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.jelvdws38
    //   server side: http://getblimp.github.io/django-rest-framework-jwt/

    // https://blog.hackages.io/angular-http-httpclient-same-but-different-86a50bbcc450

    let headers = new Headers();
    let authToken = sessionStorage.getItem('auth_token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `JWT ${authToken}`);

    //eventually will be required to switch to HttpClient; then this will be how to set the headers:
    //let headers = new HttpHeaders(); // this is the
    //headers = headers.set('Content-Type', 'application/json').set('Authorization', `JWT ${authToken}`);

    //console.log(headers);

    return this.http
      .get(
        UsersThisInstitutionUrl,
        { headers: headers }
      )
      .pipe(
        map(res => res.json())
      );
  }
  */

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

  /*
  fetchInstitutions() {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this.http
      .get(
        InstitutionsUrl,
        { headers }
      )
      .pipe(
        map(res => res.json())
      );
  }
  */


}
