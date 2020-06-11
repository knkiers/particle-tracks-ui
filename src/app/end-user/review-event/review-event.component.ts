import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventInfoService } from '../event-info.service';
import { EventReviewService } from '../../shared/services/event-review.service';

import { Event } from '../../shared/models/event';
import { Circle } from '../../shared/models/circle';
import { CircleActivatedDots } from '../../shared/interfaces/circle-activated-dots';
import { RoundRealPipe } from 'src/app/shared/pipes/round-real.pipe';

@Component({
  selector: 'app-review-event',
  templateUrl: './review-event.component.html',
  styleUrls: ['./review-event.component.scss']
})
export class ReviewEventComponent implements OnInit, OnDestroy {

  @Output() reviewStatus = new EventEmitter<any>();
  @Input() isPublicUser: boolean = false;

  subscription: Subscription;
  resetReviewDataSubscription: Subscription;
  event: Event = null;
  circles: Circle[] = [];
  eventActivatedDots: any[] = [];

  numberChargedParticles: number = 0;
  numberNeutralParticles: number = 0;

  errorMessages: string[] = [];
  warningMessages: any[] = [];
  correctFeatureMessages: string[] = [];
  canSubmit: boolean = true;


  constructor(
    private eventInfoService: EventInfoService,
    private eventReviewService: EventReviewService
  ) {
    this.subscription = this.eventInfoService.circleUpdated$.subscribe(
      (data: { event: Event, editModeOn: boolean, circles: Circle[], eventActivatedDots: CircleActivatedDots[] }) => {
        console.log('inside review component; event updated!');
        console.log(data.event);
        console.log(data.circles);
        console.log(data.eventActivatedDots);
        console.log(data.editModeOn);
        if (data.editModeOn) {
          this.event = data.event;
          this.circles = data.circles;
          this.eventActivatedDots = data.eventActivatedDots;
          this.updateReviewData();
        }
      });
    this.resetReviewDataSubscription = this.eventInfoService.reviewDataCleared$.subscribe(
      () => {
        this.event = null;
        this.circles = []
        this.eventActivatedDots = [];
        this.numberChargedParticles = 0;
        this.numberNeutralParticles = 0;
        this.errorMessages = [];
        this.warningMessages = [];
        this.correctFeatureMessages = [];
        this.canSubmit = true;
      }
    )
  }

  ngOnInit(): void {
  }

  updateReviewData() {
    this.errorMessages = [];
    this.correctFeatureMessages = [];
    this.warningMessages = [];
    this.canSubmit = true;
    let eventCharacterization = this.eventReviewService.characterizeEvent(this.event);
    console.log('data: ', eventCharacterization);
    this.numberChargedParticles = eventCharacterization.numberChargedParticles;
    this.numberNeutralParticles = eventCharacterization.numberNeutralParticles;
    this.checkNumberCircles();
    // things to check:
    // - number of charged particles agrees with # of circles
    // 
    // - # of incoming circles agrees with # incoming charged particles
    // - # of outgoing circles agrees with # outgoing charged particles
    // - if above two agree, then check: 
    //    - in/out property agrees for all circles
    //    - CW/CCW property agrees for all circles

    // the user can submit an analyzed event as long as the number of circles matches the number of 
    // charged particles; if there are warnings or errors, those will be noted on the "submit" page, but
    // will not impede submission.
    this.reviewStatus.emit({
      canSubmit: this.canSubmit,
      errorsExist: this.errorMessages.length > 0,
      warningsExist: this.warningMessages.length > 0
    });
  }

  checkNumberCircles() {
    if (this.circles.length !== this.numberChargedParticles) {
      this.canSubmit = false;
      this.errorMessages.push(`The number of circles (currently ${this.circles.length}) should agree with the number of charged particles (${this.numberChargedParticles}).`);
    } else {
      this.correctFeatureMessages.push("The number of circles matches the number of charged particles in the event.");
      this.checkCircleProperties();
    }
  }

  /*
  * this method is only called once it has been determined that the # of circles is equal to the # of charged particles;
  * the method checks the following:
  * - that the fit circles correspond to different charged particles (e.g., that there aren't two fit circles for one particle and none for another)
  * - that the rotation directions match correctly
  * - that the incoming/outgoing properties match correctly
  */
  checkCircleProperties() {
    let circleTracker: any[] = [];
    let bestFitIndices: number[] = [];
    let indexNotRepeated: boolean = true;
    let allRotnDirectionsCorrect: boolean = true;
    let allIncomingDirectionsCorrect: boolean = true;
    let radiusChecks: any[] = [];
    this.circles.forEach(circle => {
      let bestFitIndex = this.eventReviewService.bestFitIndex(circle, this.eventActivatedDots);
      circleTracker.push({
        circle: circle,
        bestFitIndex: bestFitIndex
      });
      if (bestFitIndices.includes(bestFitIndex)) {
        indexNotRepeated = false;
      } else {
        bestFitIndices.push(bestFitIndex);
      }
      this.eventActivatedDots.forEach((event: CircleActivatedDots) => {
        if (event.index === bestFitIndex) {
          if (event.CW !== circle.CW) {
            allRotnDirectionsCorrect = false;
          }
          if (event.incoming !== circle.incoming) {
            allIncomingDirectionsCorrect = false;
          }
          if (Math.abs(event.radius - circle.r) / event.radius > 0.02) {
            console.log(event.radius, typeof event.radius);
            console.log(circle.r, typeof circle.r);
            if (this.isPublicUser) {
              radiusChecks.push({
                circleRadius: circle.r,
                messages: [
                  `The fit radius for the circle with r = ${(circle.r).toFixed(4)} cm differs by more than 2% from
              the correct value.  You may wish to check that your fit includes all the points for the particle's path and 
              does not accidentally include points from other circles.  Also note that the fits for very small circles may not be very accurate.`,
                  `To check which points are included in the fit, 
              hover over the 'Edit circle properties' box for this circle.  (To edit the fit, start
              by deleting the circle.)  It might also help to click on 'Show Event'.`
                ]
              });
            } else {
              radiusChecks.push({
                circleRadius: circle.r,
                messages: [
                  `The fit radius for the circle with r = ${(circle.r).toFixed(4)} cm differs by more than 2% from
              the correct value.  This will not prevent you from submitting the event, but you may wish to check that your fit includes all the points for the particle's path and 
              does not accidentally include points from other circles.  Also note that the fits for very small circles may not be very accurate.`,
                  `To check which points are included in the fit, 
              go back to the previous step and hover over the 'Edit circle properties' box for this circle.  (To edit the fit, start
              by deleting the circle.)  It might also help to click on 'Show Event'.`
                ]
              });
            }
          }
        }
      });
    });
    if (!indexNotRepeated) {
      this.errorMessages.push("It appears that at least one particle's track has two or more circles fit to it.  You should fit exactly one circle to each track.");
    }
    if ((radiusChecks.length === 0) && (indexNotRepeated)) {
      this.correctFeatureMessages.push("The fit radii of the various circles agree with the correct values to within 2%.");
    }
    if (!allRotnDirectionsCorrect) {
      if (this.isPublicUser) {
        this.errorMessages.push("It appears that the rotation direction (clockwise versus counterclockwise) is set incorrectly for one or more circles.  To fix this, click on 'Edit circle properties'.  It might also help to click on 'Show Event'.");

      } else {
        this.errorMessages.push("It appears that the rotation direction (clockwise versus counterclockwise) is set incorrectly for one or more circles.  To fix this, go back to the previous step and click on 'Edit circle properties'.  It might also help to click on 'Show Event'.");
      }
    }
    if (!allIncomingDirectionsCorrect) {
      if (this.isPublicUser) {
        this.errorMessages.push("It appears that the particle direction (incoming versus outgoing) is set incorrectly for one or more circles.  To fix this, click on 'Edit circle properties'.  It might also help to click on 'Show Event'.");
      } else {
        this.errorMessages.push("It appears that the particle direction (incoming versus outgoing) is set incorrectly for one or more circles.  To fix this, go back to the previous step and click on 'Edit circle properties'.  It might also help to click on 'Show Event'.");
      }
    }
    if (this.errorMessages.length === 0) {
      // if everything else agrees, do a check of the radii....
      radiusChecks.forEach(check => this.warningMessages.push(check));
    }


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.resetReviewDataSubscription.unsubscribe();
  }

}
