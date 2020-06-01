import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

//import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs';
//import {FormsModule} from '@angular/forms';

import { EventDisplayService } from '../../shared/services/event-display.service';
import { UnitConversionService } from '../../shared/services/unit-conversion.service';
import { EventAnalysisService } from '../../shared/services/event-analysis.service';
import { SnackBarInfoService } from '../../shared/services/snack-bar-info.service';
import { EventInfoService } from '../event-info.service';

//import { CircleBindingService } from '../circle-binding.service';

import { Event } from '../../shared/models/event';
import { Dot } from '../../shared/models/dot';
import { Circle } from '../../shared/models/circle';

import { CircleActivatedDots } from '../../shared/interfaces/circle-activated-dots';

import { POINT_THREE, R_MIN, R_MAX, B_MAX } from '../../shared/services/unit-conversion.service';

// 1. QUESTION: should js-base64 be added to package.json?
// 2. TODO: If jwt times out (currently set for 10 days), give an error message
//    ("session timed out") and redirect to login page or something.  Currently it just
//    crashes...!!
// 3. Create a User object; if the user's token is still valid, but the user
//    refreshed the page or something, go fetch their info from the db and refresh
//    the user's login name in the nav bar, etc.

const AXIS_FRACTION = 0.8;

@Component({
  selector: 'app-analysis-display',
  templateUrl: 'analysis-display.component.html',
  styleUrls: ['analysis-display.component.scss']
})
export class AnalysisDisplayComponent implements OnInit, OnDestroy {

  // TODO: Should make circles and dots objects with methods; then they can 'do' things
  // to themselves, like set hovering, selecting dots, etc.;
  // could refactor this on the next go-around....

  //@Input() event: Event;
  //@Input() numberEventsRequested: any;

  userIsReadOnly: boolean = false; // set to true if viewing from the admin (for grading purposes)

  modalSaveWarningActions = new EventEmitter<string>();
  modalBrowseEventsActions = new EventEmitter<string>();
  modalCircleActions = new EventEmitter<string>();

  subscription: Subscription;
  //circleSubscription: Subscription;
  tokenExpiredSubscription: Subscription;
  eventStagedForSubmitSubscription: Subscription;


  event: Event;
  noEventRetrieved: boolean = true;
  eventActivatedDots: CircleActivatedDots[] = [];
  private eventJSON: any;
  //private eventType: any;
  private eventTypeJSON: any;
  circleChange: number = 1;//changed when a circle is changed...to wake up one or more components....
  private svgRegion: any;

  dots: Dot[] = [];
  circles: Circle[] = [];
  private numberCircles = 0;
  boundaries: any;
  momentumDiagramBoundaries: any;
  private interactionRegion: any;
  interactionLocation: any;

  //analysisComplete: boolean = false; // changed to true once enough circles (minNumberCircles) have been added
  //minNumberCircles: number = 0; // set to the # of charged particles in the event

  hAxisParams: any;
  vAxisParams: any;

  eventDisplay: any = {};

  editModeOn = false;
  revealEvent = false;
  colourModeOn: boolean = false;
  showAxes = false;

  userEvents: any = [];

  bFieldStrength: number = null; // kG; apparently the B field generated by the dipole magnets at the LHC is approximately 80 kG
  bFieldDirection = 'in';

  /*
  modalSaveWarningParams = [
    {
      dismissible: false,
      alignment: 'right',
      complete: function () { console.log('Closed'); }
    }
  ]

  modalBrowseEventsParams = [
    {
      dismissible: false,
      alignment: 'right',
      complete: function () { console.log('Closed'); }
    }
  ]
  */

  constructor(
    private route: ActivatedRoute,
    private eventInfoService: EventInfoService,
    private unitConversionService: UnitConversionService,
    private eventAnalysisService: EventAnalysisService,
    //private circleBindingService:CircleBindingService,
    private eventDisplayService: EventDisplayService,
    private snackBarInfoService: SnackBarInfoService
  ) {
    console.log('inside constructor!');

    this.subscription = eventDisplayService.gridActivationAnnounced$.subscribe(
      (gridData) => {
        this.activateDots(gridData);
      });
    this.eventStagedForSubmitSubscription = eventInfoService.eventStagedForSubmit$.subscribe(
      () => {
        console.log('inside component -- event is ready to submit!');
        this.saveEvent(true);
      }
    )
    /*
    this.circleSubscription = circleBindingService.circleUpdated$.subscribe(
      updateData=> {
        console.log('circle subscription!!!!!!!!!!');
        this.editCircleProperty(updateData);
        this.updateCircleTangentAngles();
        this.circleChange = -this.circleChange;
      });
      */
    this.tokenExpiredSubscription = eventAnalysisService.tokenExpired$.subscribe(
      (data) => {
        console.log('token timed out!');
        //this.closeBrowseEventsModal();
      });
  }

  ngOnInit() {
    console.log('inside on init!');
    // https://codecraft.tv/courses/angular/routing/parameterised-routes/
    this.route.params.subscribe(params => {
      console.log('route params subscription!', params);
      if (params['id']) {
        console.log('we have a route param! ', params['id'], typeof +params['id']);
        let id: number = +params['id'];
        this.getAnalyzedEvent(id);
      } else {

        if (!this.noEventRetrieved) {
          this.turnOffEditMode();
          this.resetAxes();
          this.event = null;
          this.noEventRetrieved = true;
          this.eventActivatedDots = [];
          this.eventDisplay = {};
          this.circles = [];
          this.eventInfoService.announceClearReviewData();
        }

        this.unitConversionService.getGrid().subscribe(
          dots => {
            this.dots = [];
            dots.forEach(dot => this.dots.push(new Dot(dot)));
            //console.log(this.dots);
          },
          err => console.log("ERROR", err));//,
        //() => console.log("Grid fetched"));
        this.unitConversionService.getBoundaries().subscribe(
          boundaries => {
            this.boundaries = boundaries.boundaries;
            this.momentumDiagramBoundaries = boundaries.momentumDiagramBoundaries;
            //this.computeAxisCoordinates();
          },
          err => console.log("ERROR", err));//,
        //() => console.log("Boundaries fetched"));
        this.unitConversionService.getInteractionRegion().subscribe(
          interactionRegion => {
            this.interactionRegion = interactionRegion;
          });
      }
    });
  }

  fetchNewEvent() {
    this.turnOffEditMode();
    this.resetAxes();
    this.event = null;//forces a redraw of the event when the new one comes in
    this.eventDisplayService.getEvent()
      .subscribe(
        event => {
          this.event = event;
          this.noEventRetrieved = false;
          //console.log('back in component! ', this.eventJSON, typeof this.eventJSON);
          //console.log(JSON.parse(this.eventJSON));
          //console.log(JSON.parse(this.event));
          //this.event = JSON.parse(this.eventJSON);
          console.log('this.event: ', this.event);
          //console.log(this.event);

          //this.calculateMinNumberCircles();
          this.resetCircles();
          this.setBFieldByEvent(this.event);
          this.initializeEvent();
        }
      );
  }

  saveEvent(submitEvent: boolean) {
    //submitting an event is simply saving it with the submit flag set to true

    let reducedDots = [];
    for (let dot of this.dots) {
      if (dot.activated) {
        reducedDots.push(dot);
      }
    }

    let eventData = {
      event: this.event,
      circles: this.circles,
      eventJSON: this.eventJSON,
      eventType: this.eventTypeJSON,
      svgRegion: this.svgRegion,
      dots: reducedDots,
      boundaries: this.boundaries,
      momentumDiagramBoundaries: this.momentumDiagramBoundaries,
      interactionRegion: this.interactionRegion,
      interactionLocation: this.interactionLocation,
      //eventDisplay: this.eventDisplay,
      bFieldStrength: this.bFieldStrength,
      bFieldDirection: this.bFieldDirection
    };
    let filename = this.event.human_readable_name;
    //console.log('about to save event.... ', eventData);
    this.eventAnalysisService.saveAnalyzedEvent(filename, eventData, submitEvent)
      .subscribe(
        savedEvent => {
          if (submitEvent) {
            // in this case the event was "submitted" (as opposed to just being auto-saved), so: 
            //  - inform the user of successful submission (toast or something similar)
            //  - reset all data for the page so that the user can start over
            this.displayPostSubmitEventMessage();
          }
        }
      );
  }

  displayPostSubmitEventMessage() {
    this.snackBarInfoService.announceEventSubmittedSnackBar();
  }

  displayUnsubmitWarningSnackbar(): void {
    this.snackBarInfoService.announceUnsubmitWarningSnackBar();
  }
  /*
  calculateMinNumberCircles() {
    let minNumCircles: number = 0;
    this.event.decay_products.forEach( (decayProduct: any) => {
      if (decayProduct.charge !== 0) {
        minNumCircles = minNumCircles + 1;
      }
    });
    if (this.event.parent.charge !== 0) {
      minNumCircles = minNumCircles + 1;
    }
    this.minNumberCircles = minNumCircles;
    console.log('MIN NUMBER CIRCLES: ', this.minNumberCircles);
  }
  */

  initializeEvent() {
    this.interactionLocation = {
      x: Math.random() * (this.interactionRegion.xmax - this.interactionRegion.xmin) + this.interactionRegion.xmin,
      y: Math.random() * (this.interactionRegion.ymax - this.interactionRegion.ymin) + this.interactionRegion.ymin
    }

    //console.log('interaction location!');
    //console.log(this.interactionLocation);

    this.eventDisplay = this.eventDisplayService.getStringEventDisplay(
      this.bFieldStrength,
      this.bFieldDirection,
      this.dots,
      this.boundaries,
      this.interactionLocation,
      this.event);

    this.computeAxisCoordinates();
    //console.log('event display: ', this.eventDisplay);
  }

  /**
   * This method looks at the event and tunes the B field so that
   * the radii of the circles for the various charged particles are
   * within an optimal range....
   */
  setBFieldByEvent(event) {
    //console.log('inside setBFieldByEvent', event);
    let pmax: number = null;
    let pmin: number = null;
    let px: number = null;
    let py: number = null;
    let pmag: number = null;
    for (let particle of event.decay_products) {
      px = particle.energy_momentum[1];
      py = particle.energy_momentum[2];
      pmag = Math.sqrt(px * px + py * py);
      if (particle.charge !== 0) {
        if (pmax === null) {
          pmax = pmag;
          pmin = pmag;
        } else if (pmag < pmin) {
          pmin = pmag;
        } else if (pmag > pmax) {
          pmax = pmag;
        }
      }
    }
    px = event.parent.energy_momentum[1];
    py = event.parent.energy_momentum[2];
    pmag = Math.sqrt(px * px + py * py);
    if (event.parent.charge !== 0) {
      if (pmax === null) {
        pmax = pmag;
        pmin = pmag;
      } else if (pmag < pmin) {
        pmin = pmag;
      } else if (pmag > pmax) {
        pmax = pmag;
      }
    }

    //console.log('pmax: ', pmax);
    //console.log('pmin: ', pmin);

    let bmin = pmax / (POINT_THREE * R_MAX);
    let bmax = pmin / (POINT_THREE * R_MIN);

    //console.log('bmin: ', bmin);
    //console.log('bmax: ', bmax);

    if (bmax > B_MAX) {
      bmax = B_MAX;
    }
    if (bmin > B_MAX) {
      bmin = B_MAX;
    }
    if (bmin > bmax) {
      bmax = bmin;
    }

    let bFieldInitialCalc = bmin + (bmax - bmin) * Math.random();
    // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
    this.bFieldStrength = Math.round((bFieldInitialCalc + 0.00000001) * 10) / 10;

  }


  /*
    this method is called after an array of activatedDots is received
    via the subscription service (following the generation of a new event)
   */
  activateDots(gridData: any) {
    //console.log('grid indices:', gridData.gridIndices);
    //console.log('grid activated dots:', gridData.gridActivatedData);
    if (this.dots !== []) {// in principle possible(?) that dots has not yet been initialized....
      this.dots.forEach(dot => {// deactivate all dots and unset useForFit as well
        dot.deactivate();
        dot.unsetUseForFit();
      });
      for (let i of gridData.gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].activate();
      }
    }
    this.eventActivatedDots = gridData.eventActivatedDots;
    //console.log('event activated dots: ', this.eventActivatedDots);
    this.eventInfoService.announceEventUpdate(this.event, this.circles, this.eventActivatedDots);
  }

  highlight(circle: Circle) {
    circle.setHovered();
    this.highlightFitDots(circle.dotIndices);
  }

  unhighlight(circle: Circle) {
    circle.setUnhovered();
    this.unhighlightFitDots(circle.dotIndices);
  }

  highlightFitDots(gridIndices: number[]) {
    //console.log('fit dots: ', gridIndices);
    if (this.dots !== []) {// in principle possible(?) that dots has not yet been initialized....
      for (let i of gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].setUseForFit();
      }
    }
  }

  unhighlightFitDots(gridIndices: number[]) {
    //console.log('fit dots: ', gridIndices);
    if (this.dots !== []) {// in principle possible(?) that dots has not yet been initialized....
      for (let i of gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].unsetUseForFit();
      }
    }
  }

  onChangedCircles() {
    //this.updateCircleTangentAngles();
    this.saveEvent(false);
    this.circleChange = this.circleChange + 1;// used to wake up one or more child components
    this.eventInfoService.announceEventUpdate(this.event, this.circles, this.eventActivatedDots);
  }

  resetCircles() {
    this.circles = [];
  }

  resetAxes() {
    this.showAxes = false;
  }

  clearDotsForFit() {
    var i;
    for (i = 0; i < this.dots.length; i++) {
      this.dots[i].useForFit = false;
    }
    //this.eventAnalysisService.clearDotsForFit(this.dots);
  }

  addCircle() {
    /*
     dataDict = {
     circle:      circleDataPx,
     error:        error,
     errorMessage: errorMessage
     };
     */
    this.hideEvent();
    var dataDict = this.eventAnalysisService.fitCircleToData(this.dots, this.boundaries);
    //var circleInputData = this.eventAnalysisService.gatherDataFromDots(this.dots);
    if (dataDict.error) {
      this.openCircleErrorModal();
    }
    if (!dataDict.error) {
      this.circles.push(new Circle(dataDict.circle));
      console.log('circles: ', this.circles);
      this.clearDotsForFit();
      this.numberCircles = this.circles.length;
      //if (this.circles.length >= this.minNumberCircles) {
      //  this.analysisComplete = true;
      //}
      //console.log(this.numberCircles);
      if (this.numberCircles >= 2) {
        this.showAxes = true;
        this.updateCircleTangentAngles();
      }
      this.circleChange = this.circleChange + 1;
      this.saveEvent(false);
      this.eventInfoService.announceEventUpdate(this.event, this.circles, this.eventActivatedDots);
    }

  }

  /*
  hoverCircle(i: number) {
    console.log('hover circle');
    
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].hovered = true;
      this.clearDotsForFit();
      for (let dotIndex of this.circles[i].dotIndices){
        console.log('FIX ME');
        // TODO: fix 
        //this.selectDotByIndex(dotIndex);
      }
    }
  
  }

  unhoverCircle(i: number) {
    console.log('unhover circle');
    
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].hovered = false;
      this.clearDotsForFit();
    }
    
  }
  */

  deleteCircle(i: number) {
    console.log('delete circle #', i);
    if (this.circles[i] !== undefined) {// in case the circle was deleted in the meantime, or something
      this.circles.splice(i, 1);
      this.circleChange = this.circleChange + 1;
      this.numberCircles = this.circles.length;
      this.clearDotsForFit();
      //console.log(this.numberCircles);
      this.saveEvent(false);
      //if (this.circles.length < this.minNumberCircles) {
      //  this.analysisComplete = false;
      //}
      if (this.numberCircles < 2) {
        this.showAxes = false;
        this.updateCircleTangentAngles();
        this.circleChange = this.circleChange + 1;
      }
      this.eventInfoService.announceEventUpdate(this.event, this.circles, this.eventActivatedDots);
    }
  }

  toggleCircleRotationDirection(i: number) {
    console.log('toggle circle rotation');
    /*
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].CW = !this.circles[i].CW;
    }
    */
  }

  updateCircleTangentAngles() {
    console.log('update circle tangent angles');
    console.log('circles: ', this.circles);
    this.circles.forEach((circle: Circle) => {
      if (!this.showAxes) {
        circle.unsetAngle();
      } else {
        let theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, circle);
        circle.setAngle(theta);
      }
    });
    console.log('done updating tangent angles');
  }


  /*
  addCircleTangentAngles() {
    for (let i in this.circles) {
      var theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, this.circles[i]);
      this.circles[i].theta = theta;
    }
  }
  */

  toggleParticleIncomingOutgoing(i: number) {
    if (this.circles[i] !== undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].incoming = !this.circles[i].incoming;
    }
  }

  editCircleProperty(updateData) {

    //console.log('inside component');
    //console.log(updateData);

    var i = updateData.index;
    var command = updateData.command;
    if (this.circles[i] !== undefined) {
      switch (command) {
        // now done directly on the object, from inside the child component....
        //case "hover":
        //  this.hoverCircle(i);
        //  break;
        //case "unhover":
        //  this.unhoverCircle(i);
        //  break;
        case "delete":
          this.deleteCircle(i);
          break;
        case "toggleRotationDirection":
          this.toggleCircleRotationDirection(i);
          break;
        case "toggleIncomingOutgoing":
          this.toggleParticleIncomingOutgoing(i);
          break;
      }
    }
  }

  computeAxisCoordinates() {
    let xmin = this.boundaries.xmin;
    let xmax = this.boundaries.xmax;
    let ymin = this.boundaries.ymin;
    let ymax = this.boundaries.ymax;
    let x = this.interactionLocation.x;
    let y = this.interactionLocation.y;

    let axisLength = (Math.min(xmax - x, x - xmin, ymax - y, y - ymin)) * AXIS_FRACTION;
    //console.log(axisLength);

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


  turnOnEditMode() {
    //console.log('inside toggle edit mode fn');
    if (!this.editModeOn) {
      this.editModeOn = true;
      this.colourModeOn = true;
    }
  }

  turnOffEditMode() {
    this.editModeOn = false;
  }

  showEvent() {
    this.revealEvent = true;
  }

  hideEvent() {
    this.revealEvent = false;
  }

  getAnalyzedEvent(id: number) {
    var eventNewData;
    // get the analyzed event from the database
    //console.log('about to get event #....');
    //console.log(id);

    this.eventAnalysisService.getAnalyzedEvent(id).subscribe(
      eventData => {
        console.log('get analyzed event: ', eventData);
        eventNewData = JSON.parse(eventData.event_data);
        this.refreshView(eventNewData, eventData.submitted);
      },
      err => console.log("ERROR", err),
      () => console.log("event fetched"));

  }

  refreshView(eventData, eventSubmitted: boolean) {
    console.log('event data: ', eventData);
    console.log('event submitted? ', eventSubmitted);
    this.event = eventData.event;
    this.noEventRetrieved = false;
    this.eventTypeJSON = eventData.eventType;
    this.svgRegion = eventData.svgRegion;
    this.eventJSON = eventData.eventJSON;
    //this.circleChange = - this.circleChange;
    /**
     *
     * the saved event only includes the activated dots, so we need to
     * reconstitute the entire dot array and then overwrite the activated
     * dots; not sure if it is safe to assume that the dots will never
     * be reordered in the list...if so, we have a problem....
     *
     */

    this.dots = [];
    let dotsFromData = this.unitConversionService.initializeGrid(eventData.boundaries);
    dotsFromData.forEach(dot => this.dots.push(new Dot(dot)));
    for (let dot of eventData.dots) {
      this.dots[dot.id] = new Dot(dot);
    }

    this.circles = [];
    eventData.circles.forEach((circle: Circle) => {
      this.circles.push(new Circle(circle));
    });

    //this.circles = eventData.circles;
    this.clearDotsForFit();

    this.numberCircles = this.circles.length;

    this.boundaries = eventData.boundaries;
    this.momentumDiagramBoundaries = eventData.momentumDiagramBoundaries;
    this.interactionRegion = eventData.interactionRegion;
    this.interactionLocation = eventData.interactionLocation;
    this.computeAxisCoordinates();

    this.editModeOn = true;
    this.revealEvent = false;
    this.colourModeOn = true;

    this.bFieldStrength = eventData.bFieldStrength;
    this.bFieldDirection = eventData.bFieldDirection;

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

    if (eventSubmitted) {
      this.displayUnsubmitWarningSnackbar();
    }

  }


  toggleColourMode() {
    console.log('colour mode toggled!');
    this.colourModeOn = !this.colourModeOn;
    console.log('colour mode is on? ', this.colourModeOn);
  }

  openCircleErrorModal() {
    //this.modalCircleActions.emit({action:"modal",params:['open']});
    console.log('open circle error modal');
  }

  closeAnalysisDisplay() {
    //this.eventAnalysisService.announcedAnalysisDisplayClosed();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    //this.circleSubscription.unsubscribe();
    this.tokenExpiredSubscription.unsubscribe();
    this.eventStagedForSubmitSubscription.unsubscribe();
    this.snackBarInfoService.announceSnackBarsDismissed();
  }

}
