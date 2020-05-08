import { Injectable } from '@angular/core';

import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
//import { tap, retry, catchError } from 'rxjs/operators';

/**
 * A small service to provide some common functions that are useful for making http requests.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

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




}
