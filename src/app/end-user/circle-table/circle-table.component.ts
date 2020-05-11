import { Component, OnInit, Input } from '@angular/core';

import { CircleBindingService } from '../circle-binding.service';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-circle-table',
  templateUrl: './circle-table.component.html',
  styleUrls: ['./circle-table.component.scss']
})
export class CircleTableComponent implements OnInit {

  @Input() circles: any;
  @Input() event: any;
  @Input() userIsReadOnly: boolean = false;

  constructor(private circleBindingService:CircleBindingService) { }

  ngOnInit(): void {
  }

  panelOpenState = false;

  panels = [
  ];

  addPanel() {
    this.panels.push({
      title: 'panel 2',
      content: 'content 2'
    })
  }

  deleteCircle(i: number){
    var updateData = {
      index: i,
      command: 'delete'
    };
    this.circleBindingService.announceCircleUpdate(updateData);
  }

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


}
