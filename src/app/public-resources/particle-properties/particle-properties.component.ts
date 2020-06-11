import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { PARTICLE_PROPERTIES } from '../../shared/static-content/particle-properties';

@Component({
  selector: 'app-particle-properties',
  templateUrl: './particle-properties.component.html',
  styleUrls: ['./particle-properties.component.scss']
})
export class ParticlePropertiesComponent implements OnInit {
  
  displayedColumns: string[] = ['symbol', 'name', 'charge', 'mass'];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(PARTICLE_PROPERTIES);
    console.log('particle props: ', PARTICLE_PROPERTIES);
  }

}
