import { Injectable } from '@angular/core';

import { Event } from '../models/event';
import { Circle } from '../models/circle';
import { CircleActivatedDots } from '../interfaces/circle-activated-dots';

@Injectable({
  providedIn: 'root'
})
export class EventReviewService {

  constructor() { }


  characterizeEvent(event: Event) {
    let incomingIsCharged: boolean = !(event.parent.charge === 0);
    let numberChargedParticles: number = 0;
    let numberNeutralParticles: number = 0;
    let eventNeutralData: any = null;
    if (incomingIsCharged) {
      numberChargedParticles++;
    } else {
      numberNeutralParticles++;
      eventNeutralData = {
        mass: event.parent.mass,
        name: event.parent.particle_name,
        particleId: event.parent.particle_id
      }
    }
    event.decay_products.forEach((particle: any) => {
      if (particle.charge === 0) {
        numberNeutralParticles++;
        eventNeutralData = {
          mass: particle.mass,
          name: particle.particle_name,
          particleId: particle.particle_id
        }
      } else {
        numberChargedParticles++;
      }
    });
    return {
      incomingIsCharged: incomingIsCharged,
      numberChargedParticles: numberChargedParticles,
      numberNeutralParticles: numberNeutralParticles,
      eventNeutralData: eventNeutralData
    }
  }

  // this method determines which set of eventActivatedDots best matches
  // the dots in circle (which is a student-defined set of circle dots)
  bestFitIndex(circle: Circle, eventActivatedDots: CircleActivatedDots[]) {
    let maxNumberMatches = 0;
    let bestIndex: number = null;
    eventActivatedDots.forEach(activatedDotsElement => {
      let numberMatches = 0;
      circle.dotIndices.forEach(circleDotIndex => {
        if (activatedDotsElement.dotIndices.includes(circleDotIndex)) {
          numberMatches++;
        }
      });
      if (numberMatches > maxNumberMatches) {
        maxNumberMatches = numberMatches;
        bestIndex = activatedDotsElement.index
      }
    });
    return bestIndex;
  }
  





}