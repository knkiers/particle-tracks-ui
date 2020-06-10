import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { UnitConversionService } from '../../shared/services/unit-conversion.service';
import { EventAnalysisService } from '../../shared/services/event-analysis.service';
import { EventDisplayService } from '../../shared/services/event-display.service';

import { UserEventAnchorDirective } from './user-event-anchor.directive';
import { MomentumAxisComponent } from '../../end-user/momentum-axis/momentum-axis.component';
import { CircleTableComponent } from '../../end-user/circle-table/circle-table.component';

import { Event } from '../../shared/models/event';
import { Dot } from '../../shared/models/dot';
import { Circle } from '../../shared/models/circle';

const AXIS_FRACTION = 0.8;

/**
 * The code in this component is a slimmed-down version of the code in the analysis-display-component; was trying to find a way
 * to reuse the code there, but that turned out to be kind of tricky, so I gave up.  This is not the best approach, clearly, but
 * it works.
 */

@Component({
  selector: 'app-analysis-display-wrapper',
  templateUrl: './analysis-display-wrapper.component.html',
  styleUrls: ['./analysis-display-wrapper.component.scss'],
  entryComponents: [MomentumAxisComponent, CircleTableComponent]
})
export class AnalysisDisplayWrapperComponent implements OnInit, AfterViewInit {

  @ViewChild(UserEventAnchorDirective, { static: false }) userEventAnchor: UserEventAnchorDirective;

  eventData: any = null;

  event: Event = null;
  circleChange: number = 1;//changed when a circle is changed...to wake up one or more components....

  dots: Dot[] = [];
  circles: Circle[] = [];
  private numberCircles = 0;
  boundaries: any;
  momentumDiagramBoundaries: any;
  interactionLocation: any;

  hAxisParams: any;
  vAxisParams: any;

  revealEvent: boolean = true;

  bFieldStrength: number = null; // kG; apparently the B field generated by the dipole magnets at the LHC is approximately 80 kG
  bFieldDirection = 'in';

  showAxes: boolean = false;
  eventDisplay: any = {};

  constructor(
    private unitConversionService: UnitConversionService,
    private eventAnalysisService: EventAnalysisService,
    private eventDisplayService: EventDisplayService) {
    console.log('in constructor; eventData: ', this.eventData);
    console.log('inside constructor; user event anchor: ', this.userEventAnchor);
  }

  ngOnInit(): void {
    console.log('in wrapper oninit; eventData: ', this.eventData);
    console.log('inside oninit; user event anchor: ', this.userEventAnchor);
  }

  ngAfterViewInit() {
    console.log('inside after view init; user event anchor: ', this.userEventAnchor);
    console.log('in after view init; eventData: ', this.eventData);
    // https://blog.angular-university.io/angular-debugging/
    // if don't wrap the following in the setTimeout(), get an ExpressionChangedAfterItHasBeenCheckedError;
    // this is probably not the ideal way to solve this problem, but don't know of another way at the moment....
    setTimeout(() => {
      this.refreshView();
    }, 0);
  }

  refreshView() {
    console.log('event data: ', this.eventData);
    this.event = this.eventData.event;
    /**
     *
     * the saved event only includes the activated dots, so we need to
     * reconstitute the entire dot array and then overwrite the activated
     * dots; not sure if it is safe to assume that the dots will never
     * be reordered in the list...if so, we have a problem....
     *
     */

    this.dots = [];
    let dotsFromData = this.unitConversionService.initializeGrid(this.eventData.boundaries);
    dotsFromData.forEach(dot => this.dots.push(new Dot(dot)));
    for (let dot of this.eventData.dots) {
      this.dots[dot.id] = new Dot(dot);
    }

    this.circles = [];
    this.eventData.circles.forEach((circle: Circle) => {
      this.circles.push(new Circle(circle));
    });

    this.clearDotsForFit();

    this.numberCircles = this.circles.length;

    this.boundaries = this.eventData.boundaries;
    this.momentumDiagramBoundaries = this.eventData.momentumDiagramBoundaries;
    this.interactionLocation = this.eventData.interactionLocation;
    this.computeAxisCoordinates();

    this.revealEvent = true;

    this.bFieldStrength = this.eventData.bFieldStrength;
    this.bFieldDirection = this.eventData.bFieldDirection;

    if (this.numberCircles >= 2) {
      this.showAxes = true;
      this.updateCircleTangentAngles();
      this.circleChange = this.circleChange + 1;
    } else {
      this.showAxes = false;
      this.circleChange = this.circleChange + 1;
    }

    this.eventDisplay = this.eventDisplayService.getStringEventDisplay(
      this.bFieldStrength,
      this.bFieldDirection,
      this.dots,
      this.boundaries,
      this.interactionLocation,
      this.event);

  }

  showEvent() {
    this.revealEvent = true;
  }

  hideEvent() {
    this.revealEvent = false;
  }

  clearDotsForFit() {
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].unsetUseForFit();
    }
  }

  closeAnalysisDisplay() {
    this.eventAnalysisService.announcedAnalysisDisplayClosed();
  }

  computeAxisCoordinates() {
    let xmin = this.boundaries.xmin;
    let xmax = this.boundaries.xmax;
    let ymin = this.boundaries.ymin;
    let ymax = this.boundaries.ymax;
    let x = this.interactionLocation.x;
    let y = this.interactionLocation.y;
    let axisLength = (Math.min(xmax - x, x - xmin, ymax - y, y - ymin)) * AXIS_FRACTION;
    // in the following, x and y are not really the x and y coords of a single point, but
    // that turns out not to matter for the conversion of the coordinates....
    var hLineStart = this.unitConversionService.translatecmtoPixels(x - axisLength, y, this.boundaries);
    var hLineEnd = this.unitConversionService.translatecmtoPixels(x + axisLength, y, this.boundaries);
    var vLineStart = this.unitConversionService.translatecmtoPixels(x, y - axisLength, this.boundaries);
    var vLineEnd = this.unitConversionService.translatecmtoPixels(x, y + axisLength, this.boundaries);
    this.hAxisParams = {
      x1: hLineStart.x,
      y1: hLineStart.y,
      x2: hLineEnd.x,
      y2: hLineEnd.y
    };
    this.vAxisParams = {
      x1: vLineStart.x,
      y1: vLineStart.y,
      x2: vLineEnd.x,
      y2: vLineEnd.y
    };
  }

  updateCircleTangentAngles() {
    this.circles.forEach((circle: Circle) => {
      if (!this.showAxes) {
        circle.unsetAngle();
      } else {
        let theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, circle);
        circle.setAngle(theta);
      }
    });
  }

  highlightFitDots(gridIndices: number[]) {
    if (this.dots !== []) {// in principle possible(?) that dots has not yet been initialized....
      for (let i of gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].setUseForFit();
      }
    }
  }

  unhighlightFitDots(gridIndices: number[]) {
    if (this.dots !== []) {// in principle possible(?) that dots has not yet been initialized....
      for (let i of gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].unsetUseForFit();
      }
    }
  }

  onChangedCircles() {
    this.circleChange = this.circleChange + 1;// used to wake up one or more child components
  }


}
