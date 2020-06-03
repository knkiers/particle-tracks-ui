import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Event } from '../shared/models/event';
import { Circle } from '../shared/models/circle';
import { CircleActivatedDots } from '../shared/interfaces/circle-activated-dots';

@Injectable({
  providedIn: 'root'
})
export class EventInfoService {

  constructor() { }

  // Observable sources
  private eventUpdatedSource = new Subject<any>();
  private eventStagedForSubmitSource = new Subject<void>();
  private clearReviewDataSource = new Subject<void>();

  //https://medium.com/@tobias.ljungstrom/how-to-use-a-custom-dialogue-with-the-candeactivate-route-guard-in-angular-385616470b6a
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  // Observable streams
  circleUpdated$ = this.eventUpdatedSource.asObservable();
  eventStagedForSubmit$ = this.eventStagedForSubmitSource.asObservable();
  reviewDataCleared$ = this.clearReviewDataSource.asObservable();

  // Service message commands
  announceEventUpdate(event: Event, editModeOn: boolean, circles: Circle[], eventActivatedDots: CircleActivatedDots[]) {
    console.log('announce event update!');
    console.log(event, circles);
    this.eventUpdatedSource.next({
      event: event,
      editModeOn: editModeOn,
      circles: circles,
      eventActivatedDots: eventActivatedDots
    });
  }

  announcedEventStagedForSubmit() {
    console.log('inside service -- announcing event ready for submit!');
    this.eventStagedForSubmitSource.next();
  }

  announceClearReviewData() {
    this.clearReviewDataSource.next();
  }

}