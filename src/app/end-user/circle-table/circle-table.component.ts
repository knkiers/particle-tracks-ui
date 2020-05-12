import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {EventAnalysisService} from '../../shared/services/event-analysis.service';
//import { CircleBindingService } from '../circle-binding.service';
//import { Subscription }   from 'rxjs';
import { Circle } from '../../shared/models/circle';

@Component({
  selector: 'app-circle-table',
  templateUrl: './circle-table.component.html',
  styleUrls: ['./circle-table.component.scss']
})
export class CircleTableComponent implements OnInit {

  @Input() circles: Circle[];
  @Input() event: any;
  @Input() userIsReadOnly: boolean = false;
  @Input() interactionLocation: any;
  @Output() circleChanged = new EventEmitter<void>();

  constructor(
    private eventAnalysisService:EventAnalysisService
    /*private circleBindingService:CircleBindingService*/) { }

  ngOnInit(): void {
  }

  deleteCircle(i: number){
    var updateData = {
      index: i,
      command: 'delete'
    };
    //this.circleBindingService.announceCircleUpdate(updateData);
    this.circleChanged.emit();
  }

  /* Changes are now made directly to the object via one of its methods, so we no longer use the service for this....
  highlightCircle(i: number){
    console.log('hovering me!');
    var updateData = {
      index: i,
      command: 'hover'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

  unhighlightCircle(i: number){
    console.log('unhovering me!');
    var updateData = {
      index: i,
      command: 'unhover'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }
  */

  resetRotationDirection(circle: Circle) {
    let currentRotationDirection = circle.CW;
    circle.setRotationDirection(!currentRotationDirection);
    let theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, circle);
        circle.setAngle(theta);
    console.log('rotn direction changed! ', circle);
    this.circleChanged.emit();
  }
  resetParticleDirection(circle: Circle) {
    let currentParticleDirection = circle.incoming;
    circle.setParticleDirection(!currentParticleDirection);
    console.log('particle direction changed! ', circle);
    this.circleChanged.emit();
    //var updateData = {
    //  index: i,
    //  command: 'toggleIncomingOutgoing'
    //};
    //this.circleBindingService.announceCircleUpdate(updateData);
  }

  /*
  toggleRotationDirection(i: number){
    console.log('toggle rotn dirn!');
    var updateData = {
      index: i,
      command: 'toggleRotationDirection'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

  toggleIncomingOutgoing(i: number){
    console.log('toggle particle dirn!');
    var updateData = {
      index: i,
      command: 'toggleIncomingOutgoing'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }
  */


}
