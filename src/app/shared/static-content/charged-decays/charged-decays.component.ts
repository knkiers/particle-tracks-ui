import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

export interface Decay {
  parent: string;
  children: string[];
  antiParent: string;
  antiChildren: string[];
}

const DECAY_DATA: Decay[] = [
  {
    parent: 'K-plus',
    children: [
      'pi-plus','pi-plus','pi-minus'
    ],
    antiParent: 'K-minus',
    antiChildren: [
      'pi-minus','pi-minus','pi-plus'
    ]
  },
  {
    parent: 'K-plus',
    children: [
      'pi-plus','antimuon','muon'
    ],
    antiParent: 'K-minus',
    antiChildren: [
      'pi-minus','muon','antimuon'
    ]
  },
  {
    parent: 'K-plus',
    children: [
      'pi-plus','positron','electron'
    ],
    antiParent: 'K-minus',
    antiChildren: [
      'pi-minus','electron','positron'
    ]
  },
  
];

@Component({
  selector: 'app-charged-decays',
  templateUrl: './charged-decays.component.html',
  styleUrls: ['./charged-decays.component.scss']
})
export class ChargedDecaysComponent implements OnInit {

  displayedColumns: string[] = ['decay', 'relatedDecay'];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(DECAY_DATA);
  }

}
