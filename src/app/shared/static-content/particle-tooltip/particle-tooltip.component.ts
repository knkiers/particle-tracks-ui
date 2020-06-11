import { Component, OnInit, Input } from '@angular/core';

//import { MatTooltip } from '@angular/material/tooltip';

import { Particle, PARTICLE_PROPERTIES } from '../particle-properties';

@Component({
  selector: 'particle-tt',
  templateUrl: './particle-tooltip.component.html',
  styleUrls: ['./particle-tooltip.component.scss']
})
export class ParticleTooltipComponent implements OnInit {

  @Input() particleName: string = null;

  name: string;
  symbol: string;
  humanReadableName: string;
  mass: string;
  tooltipText: string;

  particles: Particle[] = PARTICLE_PROPERTIES;
  constructor() { }

  ngOnInit(): void {
    console.log('particle name: ', this.particleName);
    this.findParticle();
  }

  findParticle() {
    for (let particle of this.particles) {
      if (particle.name === this.particleName) {
        this.name = particle.name;
        this.symbol = particle.symbol;
        this.humanReadableName = particle.humanReadableName;
        this.mass = particle.mass;
        this.tooltipText = this.humanReadableName+"; mass: "+this.mass+" MeV";
      }
    }
  }

}
