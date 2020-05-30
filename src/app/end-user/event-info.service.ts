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

  // Observable streams
  circleUpdated$ = this.eventUpdatedSource.asObservable();
  eventStagedForSubmit$ = this.eventStagedForSubmitSource.asObservable();
  reviewDataCleared$ = this.clearReviewDataSource.asObservable();

  // Service message commands
  announceEventUpdate(event: Event, circles: Circle[], eventActivatedDots: CircleActivatedDots[]) {
    console.log('announce event update!');
    console.log(event, circles);
    this.eventUpdatedSource.next({
      event: event, 
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