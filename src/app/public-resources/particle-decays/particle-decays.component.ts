import { Component, OnInit } from '@angular/core';
import { ChargedDecaysComponent } from 'src/app/shared/static-content/charged-decays/charged-decays.component';
import { NeutralDecaysComponent } from 'src/app/shared/static-content/neutral-decays/neutral-decays.component';

@Component({
  selector: 'app-particle-decays',
  templateUrl: './particle-decays.component.html',
  styleUrls: ['./particle-decays.component.scss'],
  entryComponents: [ChargedDecaysComponent, NeutralDecaysComponent]
})
export class ParticleDecaysComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
