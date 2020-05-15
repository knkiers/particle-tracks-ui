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

  // Observable source
  private eventUpdatedSource = new Subject<any>();

  // Observable stream
  circleUpdated$ = this.eventUpdatedSource.asObservable();

  // Service message commands
  announceEventUpdate(event: Event, circles: Circle[], eventActivatedDots: CircleActivatedDots[]) {
    console.log('inside service');
    console.log(event, circles);
    this.eventUpdatedSource.next({
      event: event, 
      circles: circles,
      eventActivatedDots: eventActivatedDots
    });
  }

}