import { Component, OnInit, Input } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { POINT_THREE } from '../../shared/services/unit-conversion.service';
import { EventAnalysisService } from '../../shared/services/event-analysis.service';
import { EventDisplayService } from '../../shared/services/event-display.service';
import { UnitConversionService } from '../../shared/services/unit-conversion.service';
import { EventReviewService, CharacterizedEvent } from '../../shared/services/event-review.service';

import { Particle, EventType, EventsSameSignature } from '../../shared/interfaces/event-type';
import { CircleActivatedDots } from '../../shared/interfaces/circle-activated-dots';

/**
 * This component is instantiated from UserEventsComponent, which sets
 * the value of eventData
 */

export interface StudentDatum {
  charge: number | null;
  CW: boolean | null;
  activatedDotsIndex: number | null;
  circleNumber: number | null | string;
  energy: number | null | string;
  error: boolean;
  incoming: boolean | null;
  inout: string | null;
  mass: number | null | string;
  name: string | null;
  particleId: number | null;
  pMag: number | null | string;
  px: number | null | string;
  py: number | null | string;
  r: number | null | string;
  summaryRow: boolean;
  theta: number | null | string;
  canBeCalculated: boolean; // if it is possible to do a calculation using this row (i.e., should it be clickable)
  icon: string; // empty string or something like a calculator (can be calculated) or check mark
  isBeingCalculated: boolean; // used to determine if some elements are shown in bold face
}

export interface StudentIncorrectData {
  decayTypeIsCorrect: boolean; //true if the decay type is correct, but the final state particles are mixed up
  name: string; //name of the process for the incorrect particle assignments
  studentData: StudentDatum[];
  //studentDataSource: MatTableDataSource<any>;
}

@Component({
  selector: 'app-event-energy-momentum',
  templateUrl: './event-energy-momentum.component.html',
  styleUrls: ['./event-energy-momentum.component.scss']
})
export class EventEnergyMomentumComponent implements OnInit {

  @Input() eventData: any = null;

  displayedColumnsEventDataSummary: string[] = ['particle', 'inOut', 'xY', 'theta', 'momentum', 'px', 'py', 'mass', 'energy', 'beta'];
  //displayedColumnsStudentData: string[] = ['particle', 'circleNumber', 'inOut', 'mass', 'radius', 'theta', 'momentum', 'px', 'py', 'energy'];

  eventSummaryDataSource: MatTableDataSource<any>;
  //studentDataSource: MatTableDataSource<any>;

  numDigits: number = 4;
  numBetaDigits: number = 7;

  revealedEvent: string = ''; // the event in question, but with the "X" and "Y" replaced by the actual particle names
  eventsSameSignature: EventsSameSignature; // all events in the database that match the current event's signature

  eventActivatedDots: CircleActivatedDots[] = []; // an array containing sets of activated dots and other properties for each particle in the event
  studentData: StudentDatum[] = [];

  studentIncorrectData: StudentIncorrectData[] = []; // stores data related to incorrect (but still reasonable, based on charge) particle assignments

  eventDataSummary: any = null;
  errorMessages: any = [];
  studentDataIsValid: boolean = true;
  characterizedEvent: CharacterizedEvent;
  //numberChargedParticles: number = 0;
  //numberNeutralParticles: number = 0;
  //eventNeutralData: any = null;//if there is a neutral particle, this contains its mass and name
  //incomingIsCharged: boolean = true;
  //neutralParticleData: any = null; // if there is a neutral particle (assumed to at most one neutral particle!), this will contain some of its data

  errorMessage: string = '';

  constructor(
    private eventDisplayService: EventDisplayService,
    private eventAnalysisService: EventAnalysisService,
    private unitConversionService: UnitConversionService,
    private eventReviewService: EventReviewService,
    breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.matches) {
        this.activateSmallLayout(result);
      }
    });
    breakpointObserver.observe([
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.matches) {
        this.activateMediumLayout(result);
      }
    });
    breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        this.activateLargeLayout(result);
      }
    });
  }

  ngOnInit(): void {
    console.log('Inside on init!');
    this.buildEventDataSummary();
    this.characterizedEvent = this.characterizeEvent(); // determine # of charged/neutral particles, etc.
    this.determineActivatedDots();
    let studentDataOriginal = this.buildStudentData();
    this.checkErrors(studentDataOriginal);
    this.studentData = this.checkEnergyMomentumConservation(studentDataOriginal);
    console.log('student data: ', this.studentData);
    //this.studentDataSource = new MatTableDataSource(this.studentData);
    if (this.errorMessages.length === 0) {
      // if there are no gross errors (CW/CCW property, incoming/outgoing property, # of circles), check to see what would be obtained if charged particles were misidentified
      this.buildTablesIncorrectAssignments();
    } else {
      // there were apparently one or more gross errors, so fetch the data about other possible decays, but don't bother putting together the tables
      this.fetchEventsSameSignature();
    }
  }

  activateSmallLayout(result: any): void {
    console.log('result: ', result);
    console.log('we have a small layout!');
    this.numDigits = 2;
    this.numBetaDigits = 4;
  }

  activateMediumLayout(result: any): void {
    console.log('result: ', result);
    console.log('we have a medium layout!');
    this.numDigits = 3;
    this.numBetaDigits = 6;
  }

  activateLargeLayout(result: any): void {
    console.log('result: ', result);
    console.log('we have a large layout!');
    this.numDigits = 4;
    this.numBetaDigits = 7;
  }

  // the data coming from the server has px and py, but not |p|, which is
  // also useful in the template, so those are added here
  buildEventDataSummary() {
    this.eventDataSummary = [];
    let px = this.eventData.event.parent.energy_momentum[1];
    let py = this.eventData.event.parent.energy_momentum[2];
    let theta = (Math.atan2(py, px) + 2 * Math.PI) % (2 * Math.PI);
    this.eventDataSummary.push(
      {
        name: this.eventData.event.parent.particle_name,
        alias: this.eventData.event.parent.particle_alias,
        inout: 'in',
        mass: this.eventData.event.parent.mass,
        px: px,
        py: py,
        theta: theta,
        pMag: Math.sqrt(px * px + py * py),
        energy: this.eventData.event.parent.energy_momentum[0]
      });
    this.eventData.event.decay_products.forEach(particle => {
      let Ep = particle.energy_momentum;
      let pMag = Math.sqrt(Ep[1] * Ep[1] + Ep[2] * Ep[2]);
      this.eventDataSummary.push({
        name: particle.particle_name,
        alias: particle.particle_alias,
        inout: 'out',
        mass: particle.mass,
        px: Ep[1],
        py: Ep[2],
        theta: (Math.atan2(Ep[2], Ep[1]) + 2 * Math.PI) % (2 * Math.PI),
        pMag: pMag,
        energy: Ep[0]
      });
    });
    this.eventSummaryDataSource = new MatTableDataSource(this.eventDataSummary);
  }

  characterizeEvent() {
    return this.eventReviewService.characterizeEvent(this.eventData.event);
    //this.incomingIsCharged = eventCharacterization.incomingIsCharged;
    //this.numberChargedParticles = eventCharacterization.numberChargedParticles;
    //this.numberNeutralParticles = eventCharacterization.numberNeutralParticles;
    //this.eventNeutralData = eventCharacterization.eventNeutralData;
  }

  fetchEventsSameSignature() {
    // Normally this.buildTablesIncorrectAssignments() is called (to work out the various ways that the student could have
    // assigned the particles incorrectly).  This method is called if there have been one or more gross errors.  In that
    // case, we just want a list of the various possible decays, etc.
    this.eventDisplayService.getEventsSameSignature(this.eventData.event.event_type_id)
      .subscribe(
        (results: EventsSameSignature) => {
          console.log('events same signature: ', results);
          this.revealedEvent = results.original_decay.name;
          this.eventsSameSignature = results;
          //eventsSameSignature.matching_decays.forEach((eventType: EventType) => {
          //  this.eventsSameSignature.push(eventType.name);
          //});
          console.log('revealed event: ', this.revealedEvent);
          console.log('events same signature: ', this.eventsSameSignature);
          //this.assembleIncorrectAnalyses();
        },
        error => {
          this.errorMessage = error;
        }
      );
  }

  buildTablesIncorrectAssignments() {
    console.log('inside build tables');
    //console.log('student incorrect data: ', this.studentIncorrectData);

    // this method builds the tables for all ways that the student could have interchanged charged particles in a reasonable way
    if (this.errorMessages.length === 0) {
      // only proceed if the analysis is otherwise correct (correct number of circles, etc.)
      this.eventDisplayService.getEventsSameSignature(this.eventData.event.event_type_id)
        .subscribe(
          (results: EventsSameSignature) => {
            console.log('events same signature: ', results);
            this.revealedEvent = results.original_decay.name;
            this.eventsSameSignature = results;
            //eventsSameSignature.matching_decays.forEach((eventType: EventType) => {
            //  this.eventsSameSignature.push(eventType.name);
            //});
            console.log('revealed event: ', this.revealedEvent);
            console.log('events same signature: ', this.eventsSameSignature);
            this.assembleIncorrectAnalyses();
          },
          error => {
            this.errorMessage = error;
          }
        );
    }
  }

  assembleIncorrectAnalyses() {
    if (!this.eventData.event.is_two_body_decay) {
      // This is a three (or more) body decay.  At this point only support 2- or 3-body decays.  Assume that there could
      // be at most two particles in the final state that have the same charge as each other and that those could reasonably
      // have been mixed up by the student, even if the correct process was chosen.
      let alteredStudentDataOriginal: StudentDatum[] | boolean = this.swapMassesInStudentData(this.studentData);

      if (typeof alteredStudentDataOriginal !== 'boolean') {
        // now check energy and momentum conservation and add in corresponding rows
        let alteredStudentData = this.checkEnergyMomentumConservation(alteredStudentDataOriginal);
        // ...and push the result to the array of incorrect data 
        this.studentIncorrectData.push({
          decayTypeIsCorrect: true,
          name: this.revealedEvent,
          studentData: alteredStudentData
          //studentDataSource: new MatTableDataSource(alteredStudentData)
        });
      }
    }
    // now need to try different processes altogether and interchange final state particles in a reasonable way;
    // then, if this is a 3-body decay, need to interchange the final-state particles that have the same charge and
    // try that, too....
    this.eventsSameSignature.matching_decays.forEach((matchingDecay: EventType) => {
      if (!this.decaysAreEquivalent(matchingDecay, this.eventsSameSignature.original_decay)) {
        // skip the one that matches the original one, since we handled that above....
        let alteredStudentDataOriginal: StudentDatum[] | boolean = this.createStudentDataWithIncorrectEvent(matchingDecay);

        if (typeof alteredStudentDataOriginal !== 'boolean') {
          // now check energy and momentum conservation and add in corresponding rows
          let alteredStudentData = this.checkEnergyMomentumConservation(alteredStudentDataOriginal, matchingDecay);
          // ...and push the result to the array of incorrect data 
          this.studentIncorrectData.push({
            decayTypeIsCorrect: false,
            name: matchingDecay.name,
            studentData: alteredStudentData
            //studentDataSource: new MatTableDataSource(alteredStudentData)
          });
          if (!this.eventData.event.is_two_body_decay) {
            // This is a three (or more) body decay.  At this point only support 2- or 3-body decays.
            // In the code above, we chose one possibilities for the particle assignments for the two 
            // equally-charged particles (if there were two outgoing particles with the same charge)...now
            // do the other one
            let secondAlteredDataOriginal: StudentDatum[] | boolean = this.swapMassesInStudentData(alteredStudentData);

            if (typeof secondAlteredDataOriginal !== 'boolean') {
              // now check energy and momentum conservation and add in corresponding rows
              let secondAlteredData = this.checkEnergyMomentumConservation(secondAlteredDataOriginal, matchingDecay);
              // ...and push the result to the array of incorrect data 
              this.studentIncorrectData.push({
                decayTypeIsCorrect: false,
                name: matchingDecay.name,
                studentData: secondAlteredData
                //studentDataSource: new MatTableDataSource(secondAlteredData)
              });
            }
          }
        }
      } else {
        console.log('found the original decay!  skipping it....');
      }
    });
    console.log('student incorrect data: ', this.studentIncorrectData);
  }


  decaysAreEquivalent(event1: EventType, event2: EventType): boolean {
    // check if two event types match by checking the ids of the initial and final-state particles;
    // note that can't just check the ids of the event-type, since there could be more than
    // one copy of a type of event in the database (with different particles "hidden")
    if (event1.decay_products.length !== event2.decay_products.length) {
      return false;
    }
    if (event1.parent.id !== event2.parent.id) {
      return false;
    }
    return this.listsIdentical(event1.decay_products.map(dp => dp.id), event2.decay_products.map(dp => dp.id));
  }

  listsIdentical(list1: number[], list2: number[]): boolean {
    // https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values
    if (list1.length !== list2.length) {
      return false;
    }
    return this.containsAll(list1, list2) && this.containsAll(list2, list1);
  }

  containsAll(list1: number[], list2: number[]): boolean {
    // checks if every element of list2 is in list1
    let everyElementInList2IsInList1: boolean = true;
    list2.forEach(el => {
      if (!list1.includes(el)) {
        everyElementInList2IsInList1 = false;
      }
    });
    return everyElementInList2IsInList1;
  }

  createStudentDataWithIncorrectEvent(eventType: EventType): (StudentDatum[] | boolean) {
    if (this.errorMessages.length !== 0) {
      // shouldn't happen, but just in case....
      console.log('There seems to be a problem -- should not be here if there are error messages');
      return false;
    }
    let studentIncorrectData: StudentDatum[] = [];
    let numberDecayProducts = 0;
    this.studentData.forEach((actualStudentDatum: StudentDatum) => {
      if ((actualStudentDatum.incoming === false) && (actualStudentDatum.summaryRow === false)) {
        numberDecayProducts += 1;
      }
    });
    if (eventType.decay_products.length !== numberDecayProducts) {
      // shouldn't happen, but just in case....
      console.log('There seems to be a problem -- the numbers of decay products do not match');
      return false;
    }
    let decayProductIndicesUsed: number[] = [];
    console.log('>>>>>>>starting a new one>>>>>');
    console.log('student data: ', this.studentData);
    this.studentData.forEach((actualStudentDatum: StudentDatum) => {
      if ((actualStudentDatum.summaryRow === false) && (actualStudentDatum.charge !== 0)) {// don't include neutral particles, since they get added later using checkEnergyMomentumConservation(...)
        if (actualStudentDatum.incoming === true) {
          // this is an incoming particle
          let studentDatum: StudentDatum = JSON.parse(JSON.stringify(actualStudentDatum));
          console.log('incoming; actual student datum: ', actualStudentDatum);
          if (actualStudentDatum.charge !== eventType.parent.charge) {
            console.log('There seems to be a problem -- charges of incoming particles do not match');
            return false;
          } else {
            let pMag = actualStudentDatum.pMag;
            let newMass = eventType.parent.mass;
            let newEnergy = Number.POSITIVE_INFINITY; // just in case....
            if (typeof pMag === 'number') {
              // should be the case....
              newEnergy = Math.sqrt(pMag * pMag + newMass * newMass);
            }
            studentDatum.energy = newEnergy;
            studentDatum.mass = newMass;
            studentDatum.name = eventType.parent.name;
            studentDatum.particleId = eventType.parent.id;
            studentIncorrectData.push(studentDatum);
          }
        } else {
          // this is one of the outgoing particles;
          // search for an outgoing particle in eventType that has the same charge and use its data;
          // keep track of the index so that we don't use the same one twice....
          let index: number = 0;
          let chosenIndex: number = -1;
          let foundOne: boolean = false;
          let studentDatum: StudentDatum = JSON.parse(JSON.stringify(actualStudentDatum));
          //console.log('outgoing; actual student datum: ', actualStudentDatum);
          eventType.decay_products.forEach((decayProduct: Particle) => {
            if ((decayProduct.charge === studentDatum.charge) && (!decayProductIndicesUsed.includes(index)) && (!foundOne)) {
              // we haven't used this one yet....
              chosenIndex = index;
              decayProductIndicesUsed.push(chosenIndex);
              foundOne = true;
              //console.log('found one....; chosen index: ', chosenIndex);
              //console.log('charge: ', studentDatum.charge);
              //console.log('decay product: ', decayProduct);
              //console.log('decayProductIndicesUsed: ', decayProductIndicesUsed);

            }
            index += 1;
          });
          if (!foundOne) {
            console.log('There seems to be a problem -- charges of outgoing particles do not match');
            //console.log('charge: ', studentDatum.charge);
            //console.log('chosen index: ', chosenIndex);
            //console.log('decayProductIndicesUsed: ', decayProductIndicesUsed);
            return false;
          } else {
            let pMag = actualStudentDatum.pMag;
            let newMass = eventType.decay_products[chosenIndex].mass;
            let newEnergy = Number.POSITIVE_INFINITY; // just in case....
            if (typeof pMag === 'number') {
              // should be the case....
              newEnergy = Math.sqrt(pMag * pMag + newMass * newMass);
            }
            studentDatum.energy = newEnergy;
            studentDatum.mass = newMass;
            studentDatum.name = eventType.decay_products[chosenIndex].name;
            studentDatum.particleId = eventType.decay_products[chosenIndex].id;
            studentIncorrectData.push(studentDatum);
          }
        }
      }
    });
    return studentIncorrectData;
  }

  swapMassesInStudentData(studentData: StudentDatum[]): (StudentDatum[] | boolean) {
    // searches through final state particles in studentDatum to see if exactly two of them have the
    // same charge; if they do, interchanges the particles and recomputes the energy;
    // if there are not exactly two particles with the same charge that can be exchanged, returns false
    let studentIncorrectData: StudentDatum[] = [];
    studentData.forEach((studentDatum: StudentDatum) => {
      if (!studentDatum.summaryRow) {
        studentIncorrectData.push(JSON.parse(JSON.stringify(studentDatum)));
      }
    });

    let positiveChargeIndices: number[] = [];
    let negativeChargeIndices: number[] = [];
    let indicesToBeSwapped: number[] = [];
    let index: number = 0;
    //summary rows should be excluded in the following, but checking anyway....
    studentIncorrectData.forEach(datum => {
      if ((!datum.summaryRow) && (datum.incoming === false)) {
        if (datum.charge === 1) {
          positiveChargeIndices.push(index);
        } else if (datum.charge === -1) {
          negativeChargeIndices.push(index);
        }
      }
      index += 1;
    });
    if (positiveChargeIndices.length === 2) {
      indicesToBeSwapped = [];
      positiveChargeIndices.forEach(index => {
        indicesToBeSwapped.push(index);
      });
    }
    if (negativeChargeIndices.length === 2) {
      indicesToBeSwapped = [];
      negativeChargeIndices.forEach(index => {
        indicesToBeSwapped.push(index);
      });
    }
    if (negativeChargeIndices.length > 2 || positiveChargeIndices.length > 2 || ((negativeChargeIndices.length > 1) && (positiveChargeIndices.length > 1))) {
      console.log('>>>>There are more ambiguities possible than we are taking into account!');
      return false;
    }

    console.log('positive: ', positiveChargeIndices);
    console.log('negative: ', negativeChargeIndices);
    if (indicesToBeSwapped.length === 2) {
      if (studentIncorrectData[indicesToBeSwapped[0]].particleId === studentIncorrectData[indicesToBeSwapped[1]].particleId) {
        console.log('the particles that would be swapped are identical to each other, so no point swapping');
        return false;
      }
      let mass0 = studentIncorrectData[indicesToBeSwapped[0]].mass;
      let mass1 = studentIncorrectData[indicesToBeSwapped[1]].mass;
      let pMag0 = studentIncorrectData[indicesToBeSwapped[0]].pMag;
      let pMag1 = studentIncorrectData[indicesToBeSwapped[1]].pMag;
      let name0 = studentIncorrectData[indicesToBeSwapped[0]].name;
      let name1 = studentIncorrectData[indicesToBeSwapped[1]].name;
      let id0 = studentIncorrectData[indicesToBeSwapped[0]].particleId;
      let id1 = studentIncorrectData[indicesToBeSwapped[1]].particleId;

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY
      let newEnergy0: number = Number.POSITIVE_INFINITY; // just in case....
      let newEnergy1: number = Number.POSITIVE_INFINITY; // just in case....
      if ((typeof pMag0 === 'number') && (typeof pMag1 === 'number') && (typeof mass0 === 'number') && (typeof mass1 === 'number')) {
        // the pMags must be numbers in this case....
        newEnergy0 = Math.sqrt(pMag0 * pMag0 + mass1 * mass1);
        newEnergy1 = Math.sqrt(pMag1 * pMag1 + mass0 * mass0);
      }
      studentIncorrectData[indicesToBeSwapped[0]].mass = mass1;
      studentIncorrectData[indicesToBeSwapped[1]].mass = mass0;
      studentIncorrectData[indicesToBeSwapped[0]].energy = newEnergy0;
      studentIncorrectData[indicesToBeSwapped[1]].energy = newEnergy1;
      studentIncorrectData[indicesToBeSwapped[0]].name = name1;
      studentIncorrectData[indicesToBeSwapped[1]].name = name0;
      studentIncorrectData[indicesToBeSwapped[0]].particleId = id1;
      studentIncorrectData[indicesToBeSwapped[1]].particleId = id0;
    } else {
      return false;
    }
    return studentIncorrectData;
  }

  // this method is used to determine what the students should get for the
  // various momenta, based on the radii of the circles, etc.
  buildStudentData(): StudentDatum[] {
    console.log('inside build student data: ', this.eventData);
    let studentData: StudentDatum[] = [];
    let bMag = this.eventData.bFieldStrength;
    let circleNumber: number = 1;
    this.eventData.circles.forEach(circle => {
      let pMag = circle.r * POINT_THREE * bMag;
      let bestFitIndex = this.bestFitIndex(circle);
      let bestFitMass: number | null = null;
      let energyFit: number | null = null;
      let name: string | null = null;
      let charge: number | null = null;
      let particleId: number | null = null;
      if (bestFitIndex !== null) {
        bestFitMass = this.eventActivatedDots[bestFitIndex].mass;
        energyFit = Math.sqrt(pMag * pMag + bestFitMass * bestFitMass);
        name = this.eventActivatedDots[bestFitIndex].name;
        charge = this.eventActivatedDots[bestFitIndex].charge;
        particleId = this.eventActivatedDots[bestFitIndex].particleId;
      }
      studentData.push(
        {
          particleId: particleId,
          charge: charge,
          circleNumber: circleNumber,
          inout: circle.incoming ? 'in' : 'out',//text for template
          incoming: circle.incoming,//boolean
          CW: circle.CW,
          r: circle.r,
          pMag: pMag,
          px: pMag * Math.cos(circle.theta),
          py: pMag * Math.sin(circle.theta),
          theta: circle.theta,
          mass: bestFitMass,
          energy: energyFit,
          name: name,
          activatedDotsIndex: bestFitIndex,
          error: false,
          summaryRow: false,// true for the summary rows at the end of the table....
          canBeCalculated: true,
          icon: 'calculate',
          isBeingCalculated: false
        }
      );
      circleNumber++;
    });
    return studentData;
  }

  /*
  computedTable(studentData: StudentDatum[]): StudentDatum[] {
    let computedStudentData: StudentDatum[] = JSON.parse(JSON.stringify(studentData));
    return computedStudentData;
  }
  */

  determineActivatedDots() {
    this.eventActivatedDots = [];
    let bMag = this.eventData.bFieldStrength;
    let bFieldDirection = this.eventData.bFieldDirection;
    /**
     *
     * the saved event only includes the activated dots, so we need to
     * reconstitute the entire dot array and then overwrite the activated
     * dots; not sure if it is safe to assume that the dots will never
     * be reordered in the list...if so, we have a problem....
     *
     */
    let dots = this.unitConversionService.initializeGrid(this.eventData.boundaries);
    for (let dot of this.eventData.dots) {
      dots[dot.id] = dot;
    }
    //let dots = this.eventData.dots;
    let boundaries = this.eventData.boundaries;
    let interactionLocation = this.eventData.interactionLocation;

    // determine the activated dots for the parent
    let charge = this.eventData.event.parent.charge;
    let px = this.eventData.event.parent.energy_momentum[1];
    let py = this.eventData.event.parent.energy_momentum[2];
    let pMag = Math.sqrt(px * px + py * py);
    let r = pMag / (POINT_THREE * bMag);

    let activatedDotIndex = 0;
    if (charge != 0) {
      let particleDirection = this.eventDisplayService.inOut(bFieldDirection, charge);
      let pathParams = this.eventDisplayService.curvedPathParams(bMag, dots, boundaries, interactionLocation,
        px, py, particleDirection, 'incoming');
      this.eventActivatedDots.push({
        momentum: pMag,
        radius: r,
        particleId: this.eventData.event.parent.particle_id,
        charge: this.eventData.event.parent.charge,
        dotIndices: pathParams.activatedDots,
        mass: this.eventData.event.parent.mass,
        index: activatedDotIndex,
        name: this.eventData.event.parent.particle_name,
        incoming: true,
        CW: particleDirection === 'cw'
      });
      activatedDotIndex++;
    }

    // determine the activated dots for the decay products
    this.eventData.event.decay_products.forEach(particle => {
      let charge = particle.charge;
      let particleId = particle.particle_id;
      let px = particle.energy_momentum[1];
      let py = particle.energy_momentum[2];
      let pMag = Math.sqrt(px * px + py * py);
      let r = pMag / (POINT_THREE * bMag);

      if (charge != 0) {
        let particleDirection = this.eventDisplayService.inOut(bFieldDirection, charge);
        let pathParams = this.eventDisplayService.curvedPathParams(bMag, dots, boundaries, interactionLocation,
          px, py, particleDirection, 'outgoing');

        //console.log('particle direction: ', particleDirection);
        //console.log('pathParams: ', pathParams);

        this.eventActivatedDots.push({
          momentum: pMag,
          radius: r,
          particleId: particleId,
          charge: particle.charge,
          dotIndices: pathParams.activatedDots,
          mass: particle.mass,
          index: activatedDotIndex,
          name: particle.particle_name,
          incoming: false,
          CW: particleDirection === 'cw'
        });
        activatedDotIndex++;
      }
    });

    console.log('activated dots: ', this.eventActivatedDots);

  }

  // this method determines which set of eventActivatedDots best matches
  // the dots in circle (which is a student-defined set of circle dots)
  bestFitIndex(circle) {
    return this.eventReviewService.bestFitIndex(circle, this.eventActivatedDots);
  }

  /**
   * this method checks for some gross errors, such as:
   *  - the number of student-created circles is > or < than the # of charged particles
   *  - two or more student-created circles appear to correspond to the same charged particle
   */
  checkErrors(studentData: any) {
    // check # of student circles and compare against event data
    if (this.eventData.circles && this.eventData.circles.length > this.characterizedEvent.numberChargedParticles) {
      this.errorMessages.push('The number of student-created circles exceeds the number of charged particles in the event.');
      this.studentDataIsValid = false;
    }
    if (this.eventData.circles && this.eventData.circles.length < this.characterizedEvent.numberChargedParticles) {
      this.errorMessages.push('The number of student-created circles is less than the number of charged particles in the event.');
      this.studentDataIsValid = false;
    }

    // check "incoming" and "outgoing" properties for students' data
    let circleNumber: number = 0;
    console.log(studentData);
    studentData.forEach(circle => {
      //console.log('circleNumber: ', circleNumber);
      //console.log('circle: ', circle);
      if (this.eventActivatedDots[circle.activatedDotsIndex].incoming !== circle.incoming) {
        this.studentDataIsValid = false;
        circle.error = true;
        this.errorMessages.push(`Circle #${circleNumber + 1}: incoming/outgoing property of the circle does not match that of the particle in the event.`);
      }
      //check for a repeat
      for (var i = circleNumber + 1; i < studentData.length; i++) {
        //console.log('circleNumber: ', circleNumber, 'i: ', i);
        if (circle.activatedDotsIndex === studentData[i].activatedDotsIndex) {
          // two circles refer to the same set of dots generated by a charged particle....
          this.studentDataIsValid = false;
          circle.error = true;
          studentData[i].error = true;
          this.errorMessages.push(`Circle #${circleNumber + 1} and Circle #${i + 1} appear to refer to the same charged particle track.  Hover or click the circle property panels (at the top of the page) to see which dots were used in the fits.`);
        }
      }
      //check the sense of the rotation (CW or CCW) to see if the student's data matches the actual event
      if (this.eventActivatedDots[circle.activatedDotsIndex].CW !== circle.CW) {
        this.studentDataIsValid = false;
        circle.error = true;
        this.errorMessages.push(`Circle #${circleNumber + 1}: the rotation (CW/CCW) property of the student-created circle does not match that of the particle in the event.`);
      }
      circleNumber++;
    });
  }

  checkEnergyMomentumConservation(studentDataOriginal: StudentDatum[], eventType: EventType | boolean = false): StudentDatum[] {
    // if eventType is not included, we use the default for localCharacterizedEvent (this.characterizedEvent, which is the one for the actual event);
    // otherwise we determine it for the eventType that is coming in

    let localCharacterizedEvent: CharacterizedEvent;
    if (typeof eventType !== 'boolean') {
      localCharacterizedEvent = this.eventReviewService.characterizeEventFromEventType(eventType);
    } else {
      // https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
      localCharacterizedEvent = JSON.parse(JSON.stringify(this.characterizedEvent));
    }

    let studentData: StudentDatum[] = JSON.parse(JSON.stringify(studentDataOriginal)); // clone the object, since we're going to be altering it...otherwise gets a bit confusing
    let inpx: number = 0;
    let outpx: number = 0;
    let inpy: number = 0;
    let outpy: number = 0;
    let inE: number = 0;
    let outE: number = 0;

    let maxPx: number = 0;
    let maxPy: number = 0;

    let studentDeltaData: any;

    studentData.forEach((circle: StudentDatum) => {
      if ((typeof circle.px === 'number') && (typeof circle.py === 'number')) {
        if (Math.abs(circle.px) > maxPx) {
          maxPx = Math.abs(circle.px);
        }
        if (Math.abs(circle.py) > maxPy) {
          maxPy = Math.abs(circle.py);
        }
        if (circle.incoming) {
          inpx += circle.px;
          inpy += circle.py;
          if (typeof circle.energy === 'number') {
            inE += circle.energy;
          }
        } else {
          outpx += circle.px;
          outpy += circle.py;
          if (typeof circle.energy === 'number') {
            outE += circle.energy;
          }
        }
      } else {
        console.log('There seems to be a problem -- px and/or py is not a number');
      }
    });

    // now we append and/or prepend some rows to this.studentData, which is not a great approach,
    // but not sure how else to get this information into the table....

    if (localCharacterizedEvent.numberNeutralParticles === 0) {
      studentDeltaData = {
        deltaPx: inpx - outpx,
        deltaPy: inpy - outpy,
        deltaE: inE - outE,
        deltaPxPercent: maxPx > 0 ? (inpx - outpx) * 100 / maxPx : '??',
        deltaPyPercent: maxPy > 0 ? (inpy - outpy) * 100 / maxPy : '??',
        deltaEPercent: inE > 0 ? (inE - outE) * 100 / inE : '??',
      }
    } else {// there is a neutral particle
      let mass = localCharacterizedEvent.eventNeutralData.mass;
      let name = localCharacterizedEvent.eventNeutralData.name;
      let particleId = localCharacterizedEvent.eventNeutralData.particleId;
      if (localCharacterizedEvent.incomingIsCharged) {// one of the final state particles is neutral
        let pMag = Math.sqrt((inpx - outpx) * (inpx - outpx) + (inpy - outpy) * (inpy - outpy));
        studentData.push({
          particleId: particleId,
          charge: 0,
          circleNumber: '-',
          inout: 'out',
          incoming: false,
          CW: null,
          r: '-',
          pMag: pMag,
          px: inpx - outpx,
          py: inpy - outpy,
          theta: '-',
          mass: mass,
          energy: Math.sqrt(pMag * pMag + mass * mass),
          name: name,
          activatedDotsIndex: null,
          error: false,
          summaryRow: false,
          canBeCalculated: true,
          icon: 'calculate',
          isBeingCalculated: false
        });
        let deltaE = inE - outE - Math.sqrt(pMag * pMag + mass * mass);
        studentDeltaData = {
          deltaPx: '',
          deltaPy: '',
          deltaE: deltaE,
          deltaPxPercent: '',
          deltaPyPercent: '',
          deltaEPercent: inE > 0 ? deltaE * 100 / inE : '??',
        }
      } else { // incoming particle is neutral
        let pMag = Math.sqrt(outpx * outpx + outpy * outpy);
        studentData.unshift({
          particleId: particleId,
          charge: 0,
          circleNumber: '-',
          inout: 'in',
          incoming: true,
          CW: null,
          r: '-',
          pMag: pMag,
          px: outpx,
          py: outpy,
          theta: '-',
          mass: mass,
          energy: Math.sqrt(pMag * pMag + mass * mass),
          name: name,
          activatedDotsIndex: null,
          error: false,
          summaryRow: false,
          canBeCalculated: true,
          icon: 'calculate',
          isBeingCalculated: false
        });
        inE = Math.sqrt(pMag * pMag + mass * mass)
        let deltaE = inE - outE;
        studentDeltaData = {
          deltaPx: '',
          deltaPy: '',
          deltaE: deltaE,
          deltaPxPercent: '',
          deltaPyPercent: '',
          deltaEPercent: inE > 0 ? deltaE * 100 / inE : '??',
        }
      }
    }
    // the following is a work-around so that we can get the elements to appear in the table....
    studentData.push({
      particleId: null,
      charge: null,
      circleNumber: null,
      inout: null,
      incoming: null,
      CW: null,
      r: null,
      pMag: '&Delta;:<sup>**</sup>',
      px: studentDeltaData.deltaPx,
      py: studentDeltaData.deltaPy,
      theta: null,
      mass: '',
      energy: studentDeltaData.deltaE,
      name: null,
      activatedDotsIndex: null,
      error: false,
      summaryRow: true,
      canBeCalculated: false,
      icon: 'west',
      isBeingCalculated: true
    });
    studentData.push({
      particleId: null,
      charge: null,
      circleNumber: null,
      inout: null,
      incoming: null,
      CW: null,
      r: null,
      pMag: '&Delta;%:<sup>**</sup>',
      px: studentDeltaData.deltaPxPercent,
      py: studentDeltaData.deltaPyPercent,
      theta: null,
      mass: null,
      energy: studentDeltaData.deltaEPercent,
      name: null,
      activatedDotsIndex: null,
      error: false,
      summaryRow: true,
      canBeCalculated: false,
      icon: '',
      isBeingCalculated: true
    });
    //console.log('student data: ', studentData);
    return studentData;
  }

  /*
  onCalculationRowUpdate(calculationRow: number, studentDataElement: number) {
    console.log('calculationRow: ', calculationRow);
    console.log('studentDataElement: ', studentDataElement);
  }
  */



  closeAnalysisDisplay() {
    this.eventAnalysisService.announcedAnalysisDisplayClosed();
  }



}
