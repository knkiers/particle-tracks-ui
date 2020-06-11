import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

export interface NeutralDecay {
  parent: string;
  children: string[];
  antiParent?: string;
  antiChildren?: string[];
  relatedDecayText?: string;
}

const DECAY_DATA: NeutralDecay[] = [
  {
    parent: 'pi-plus',
    children: [
      'antimuon', 'neutrino'
    ],
    antiParent: 'pi-minus',
    antiChildren: [
      'muon', 'antineutrino'
    ]
  },
  {
    parent: 'pi-plus',
    children: [
      'positron', 'neutrino'
    ],
    antiParent: 'pi-minus',
    antiChildren: [
      'electron', 'antineutrino'
    ]
  },
  {
    parent: 'K-plus',
    children: [
      'antimuon', 'neutrino'
    ],
    antiParent: 'K-minus',
    antiChildren: [
      'muon', 'antineutrino'
    ]
  },
  {
    parent: 'K-plus',
    children: [
      'positron', 'neutrino'
    ],
    antiParent: 'K-minus',
    antiChildren: [
      'electron', 'antineutrino'
    ]
  },
  {
    parent: 'K-plus',
    children: [
      'pi-plus', 'pi-zero'
    ],
    antiParent: 'K-minus',
    antiChildren: [
      'pi-minus', 'pi-zero'
    ]
  },
  {
    parent: 'K-zero',
    children: [
      'pi-plus', 'pi-minus'
    ],
    relatedDecayText: '(same)'
  },
  {
    parent: 'D-zero',
    children: [
      'K-plus', 'K-minus'
    ],
    relatedDecayText: '(not included)'
  },
  {
    parent: 'D-zero',
    children: [
      'pi-plus', 'K-minus'
    ],
    relatedDecayText: '(not included)'
  },
  {
    parent: 'D-zero',
    children: [
      'pi-plus', 'pi-minus'
    ],
    relatedDecayText: '(not included)'
  },
  {
    parent: 'Sigma-plus',
    children: [
      'proton', 'photon'
    ],
    relatedDecayText: '(not included)'
  },
  {
    parent: 'Sigma-plus',
    children: [
      'proton', 'pi-zero'
    ],
    relatedDecayText: '(not included)'
  },
  {
    parent: 'Sigma-plus',
    children: [
      'pi-plus','neutron'
    ],
    relatedDecayText: '(not included)'
  },

];

@Component({
  selector: 'app-neutral-decays',
  templateUrl: './neutral-decays.component.html',
  styleUrls: ['./neutral-decays.component.scss']
})
export class NeutralDecaysComponent implements OnInit {
  
  displayedColumns: string[] = ['decay', 'relatedDecay'];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(DECAY_DATA);
  }

}
