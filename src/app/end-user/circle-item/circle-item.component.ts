import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-circle-item',
  templateUrl: './circle-item.component.html',
  styleUrls: ['./circle-item.component.scss']
})
export class CircleItemComponent implements OnInit {

  @Input() params: any;

  constructor() { }

  ngOnInit(): void {
  }

  circleColor(){
    if (this.params.hovered) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  strokeWidth(){
    if (this.params.hovered) {
      return 3;
    } else {
      return 2;
    }
  }

}
