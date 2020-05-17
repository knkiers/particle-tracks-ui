import { Injectable } from '@angular/core';

// deprecated: import {Http, Response, Headers} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject, Observable, pipe, forkJoin } from 'rxjs';
// not used: import { map } from 'rxjs/operators';
import { map, tap, retry, catchError } from 'rxjs/operators';

import { AnalyzedEventsUrl, UserEventsUrl } from './urls';

import { UnitConversionService } from './unit-conversion.service';
import { UserService } from './user.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class EventAnalysisService {

  // Observable sources
  private tokenExpiredSource = new Subject<any>();
  private analysisDisplayClosedSource = new Subject<any>();

  // Observable streams
  tokenExpired$ = this.tokenExpiredSource.asObservable();
  analysisDisplayClosed$ = this.analysisDisplayClosedSource.asObservable();

  constructor(
    private httpService: HttpService,
    private http: HttpClient,
    private unitConversionService: UnitConversionService,
    private router: Router,
    private userService: UserService) { }

  /*
   looks at the 'gridItemList' array and determines which have been selected for fitting a circle;
   returns a data list suitable for sending to circleFitter
   */
  fitCircleToData(dots, boundaries) {
    var circleInputData = this.gatherDataFromDots(dots);
    var dotIndices = circleInputData.dotIndices;

    var circleDatacm = this.circleFitter(circleInputData);
    var error = false;
    var errorMessage = '';
    var dataDict;
    var circleDataPx;
    if (circleDatacm.error) {
      errorMessage = circleDatacm.errorMessage;
      error = true;
    } else {
      circleDataPx = this.unitConversionService.translateCircleDatatoPixels(circleDatacm, boundaries, dotIndices);
    }
    dataDict = {
      circle: circleDataPx,
      error: error,
      errorMessage: errorMessage
    };
    return dataDict;
  }

  /*
   * @name circleFitter
   * @input data has two lists: data.x and data.y
   * @returns (x0, y0) and r (in cm) for the best-fit circle
   * @algorithm: http://www.dtcenter.org/met/users/docs/write_ups/circle_fit.pdf
   *
   * @note: the routine checks for colinear points, and that N >= 3.
   */
  circleFitter(data) {
    var xBar = this.mean(data.x);
    var yBar = this.mean(data.y);
    var uList = [];
    var vList = [];
    var nMax = data.x.length;
    var i;
    var circleData;

    if (nMax < 3) {
      circleData = {
        xc: 0, yc: 0, r: 0,
        error: true,
        errorMessage: 'You must choose at least three points.'
      };
      return circleData;
    }

    for (i = 0; i < nMax; i++) {
      uList.push(data.x[i] - xBar);
      vList.push(data.y[i] - yBar);
    }

    var Suu = this.SCalculator([uList, uList]);
    var Svv = this.SCalculator([vList, vList]);
    var Suv = this.SCalculator([uList, vList]);
    var Suuu = this.SCalculator([uList, uList, uList]);
    var Svvv = this.SCalculator([vList, vList, vList]);
    var Suvv = this.SCalculator([uList, vList, vList]);
    var Svuu = this.SCalculator([vList, uList, uList]);

    var mInv = this.inverseTwoByTwo([[Suu, Suv], [Suv, Svv]]);
    if (mInv.error) {
      circleData = {
        xc: 0, yc: 0, r: 0,
        error: true,
        errorMessage: 'You must choose non-colinear points.'
      };
    } else {
      var inverseMatrix = mInv.inverse;
      var coeffs = [(Suuu + Suvv) / 2, (Svvv + Svuu) / 2];
      var uc = inverseMatrix[0][0] * coeffs[0] + inverseMatrix[0][1] * coeffs[1];
      var vc = inverseMatrix[1][0] * coeffs[0] + inverseMatrix[1][1] * coeffs[1];
      var xc = uc + xBar;
      var yc = vc + yBar;
      var r = Math.sqrt(uc * uc + vc * vc + (Suu + Svv) / nMax);
      circleData = { xc: xc, yc: yc, r: r, error: false, errorMessage: '' };
    }
    return circleData;
  }

  mean(list) {
    var total = 0;
    var i;
    for (i = 0; i < list.length; i++) {
      total += list[i];
    }
    return total / list.length;
  }

  /*
   * listOfLists could be [uList, uList, vList], for example
   *
   */
  SCalculator(listOfLists) {
    var numLists = listOfLists.length;
    var i, j;
    var sublistLengths = listOfLists[0].length; //they'd better be the same length!
    var total = 0;
    var product;
    for (j = 0; j < sublistLengths; j++) {
      product = 1;
      for (i = 0; i < numLists; i++) {
        product = product * listOfLists[i][j];
      }
      total += product;
    }
    return total;
  }

  /*
   * MUST CHECK FIRST that the matrix is invertible!!!
   *
   */
  inverseTwoByTwo(matrix) {
    var a, b, c, d;
    var eps = 0.000000001;
    var error = false;
    var returnObject;
    a = matrix[0][0];
    b = matrix[0][1];
    c = matrix[1][0];
    d = matrix[1][1];
    var det = a * d - b * c;
    if (Math.abs(det) < eps) {
      returnObject = {
        error: true,
        inverse: 0
      };
      return returnObject;
    } else {
      var inverse = [[d / det, -b / det], [-c / det, a / det]];
      returnObject = {
        error: false,
        inverse: inverse
      };
      return returnObject;
    }

  }





  gatherDataFromDots(dots: any) {
    var xArray = [];
    var yArray = [];
    var dotIndices = [];

    for (let i in dots) {
      //console.log(dots[i]);
      if (dots[i].useForFit === true) {
        xArray.push(dots[i].xcm);
        yArray.push(dots[i].ycm);
        dotIndices.push(+i);//'+' converts string to number
      }
    }
    var circleInputData = {
      x: xArray,
      y: yArray,
      dotIndices: dotIndices
    }
    return circleInputData;
  }

  computeTangentAngle(axisLocation, circle) {
    var theta;
    var PI = Math.acos(-1);
    var phi = Math.atan2(axisLocation.y - circle.yc, axisLocation.x - circle.xc);
    if (!circle.CW) {
      theta = (phi + PI / 2 + 2 * PI) % (2 * PI);
    } else {
      theta = (phi + 3 * PI / 2 + 2 * PI) % (2 * PI);
    }
    return theta;
  }

  saveAnalyzedEvent(title: string, data: any, submit: boolean) {
    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    let eventData = JSON.stringify(data);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    return this.http
      .post<any>(
        AnalyzedEventsUrl,
        JSON.stringify({
          'title': title,
          'event_data': eventData,
          'submitted': submit
        }),
        httpOptions
      )
      .pipe(
        retry(1),
        tap(response => {
          console.log('response after saving event: ', response);
          //return response;
          //sessionStorage.setItem('auth_token', res.token);
        }),
        catchError(this.httpService.errorHandler)
      );
  }

  /**
   * fetches analyzed events for the logged in user
   * @returns {Observable<R>}
   */
  getAnalyzedEvents() {
    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    // first fetch the events; then do some clean-up...deleting the older saved versions for the same UUID (keep 3 at most; discard the rest)

    return this.http
      .get<any>(UserEventsUrl, httpOptions)
      .pipe(
        retry(1),
        tap(response => {
          //console.log('analyzed events for this user: ', response);
          //return response;
          //sessionStorage.setItem('auth_token', res.token);
        }),
        map( userEvents => {
          let mostRecentUserEvents: {[index: string]: any} = {};// object to sort through events
          let olderUserEventIds: number[] = [];//array of ids of events to delete
          userEvents.forEach( event => {
            let uuid = event.uuid;
            //console.log('uuid: ', uuid);
            // https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
            if (!mostRecentUserEvents.hasOwnProperty(uuid)) {
              mostRecentUserEvents[uuid] = event;
              //console.log('uuid not in list....added it');
            } else {
              //console.log('uuid was in list');
              let dateInRecentEvents = new Date(mostRecentUserEvents[uuid].created);
              let dateInEvents = new Date(event.created);
              //console.log('date of most recent event so far: ', dateInRecentEvents);
              //console.log('date of event we are looking at: ', dateInEvents);
              if (dateInEvents>dateInRecentEvents) {
                //console.log('event we are looking at is more recent; swap it in and add id of former recent event to delete list');
                let olderEventId: number = mostRecentUserEvents[uuid].id;
                mostRecentUserEvents[uuid] = event;
                olderUserEventIds.push(olderEventId);
              } else {
                //console.log('add event id to delete list');
                olderUserEventIds.push(event.id);
              }
            }
          });
          let userEventsToKeep = [];
          //https://stackoverflow.com/questions/43389414/how-to-iterate-over-keys-of-a-generic-object-in-typescript
          Object.keys(mostRecentUserEvents).forEach(key => {
            userEventsToKeep.push(mostRecentUserEvents[key]);
          });

          if (olderUserEventIds.length > 0) {
            //console.log('do some clean-up....');
            this.deleteAnalyzedEvents(olderUserEventIds)
            .subscribe(
              response => { console.log('returned from clean-up: ', response) }
            );
          }
          
          return userEventsToKeep;

        }),
        catchError(this.httpService.errorHandler)
      );
  }

  getAnalyzedEvent(id: number) {
    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    return this.http
      .get<any>(AnalyzedEventsUrl + id + '/', httpOptions)
      .pipe(
        retry(1),
        tap(response => {
          console.log('new event: ', response);
          return response;
          //sessionStorage.setItem('auth_token', res.token);
        }),
        catchError(this.httpService.errorHandler)
      );
  }

  deleteAnalyzedEvents(ids: number[]) {
    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);
    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    let observableBatch = [];

    ids.forEach( id => {
      observableBatch.push(
        this.http
          .delete<any>(AnalyzedEventsUrl + id + '/', httpOptions)
          .pipe(
            retry(1),
            tap(response => {
              console.log('deleted event: ', response);
              //return response;
              //sessionStorage.setItem('auth_token', res.token);
            }),
            catchError(this.httpService.errorHandler)
          )
      );
    });
    return forkJoin(observableBatch);
  }

  /**
   *
   * fetches an array of analyzed events; events could be for a user
   * other than the logged-in user (who should be an admin to use this method)
   *
   * see: https://stackoverflow.com/questions/35676451/observable-forkjoin-and-array-argument
   *
   * @param idList
   * @returns {any}
   *
   */
  getAnalyzedUserEvents(idList: number[]): Observable<Array<any>> {
    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    if (this.userService.tokenExpired()) {
      this.router.navigate(['/login']);
    }

    let observableBatch = [];
    idList.forEach(id => {
      observableBatch.push(
        this.http
          .get<any>(AnalyzedEventsUrl + id + '/', httpOptions)
          .pipe(
            retry(1),
            tap(response => {
              console.log('new event: ', response);
              return response;
              //sessionStorage.setItem('auth_token', res.token);
            }),
            catchError(this.httpService.errorHandler)
          ));
    });
    return forkJoin(observableBatch);
  }

  submitAnalyzedEvent(id, submit: boolean) {
    let authToken = sessionStorage.getItem('auth_token');
    let httpOptions = this.httpService.buildHttpOptionsSecure(authToken);

    if (this.userService.tokenExpired()) {
      this.tokenExpiredSource.next(null);
      this.router.navigate(['/login']);
    }

    return this.http
      .patch<any>(
        AnalyzedEventsUrl + id + '/',
        JSON.stringify({
          //'title': title,
          //'event_data': eventData,
          'submitted': submit
        }),
        httpOptions
      )
      .pipe(
        retry(1),
        tap(response => {
          console.log('new event: ', response);
          return response;
          //sessionStorage.setItem('auth_token', res.token);
        }),
        catchError(this.httpService.errorHandler)
      );
  }

  announcedAnalysisDisplayClosed() {
    this.analysisDisplayClosedSource.next(null);
  }



  /*
  clearDotsForFit(dots) {
    var i;
    for (i=0; i<dots.length; i++) {
      dots[i].useForFit = false;
    }
  }
  */


}
