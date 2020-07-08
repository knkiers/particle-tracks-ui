import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { StudentDatum } from '../event-energy-momentum/event-energy-momentum.component';

@Component({
  selector: 'app-student-data-table',
  templateUrl: './student-data-table.component.html',
  styleUrls: ['./student-data-table.component.scss']
})
export class StudentDataTableComponent implements OnInit {

  @Input() studentData: StudentDatum[];
  @Output() updateCalculationRow = new EventEmitter<number>();

  displayedColumnsStudentData: string[] = ['particle', 'circleNumber', 'inOut', 'radius', 'theta', 'momentum', 'px', 'py', 'mass', 'energy', 'beta', 'calculate'];

  computedStudentData: StudentDatum[];
  studentDataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.computedStudentData = JSON.parse(JSON.stringify(this.studentData));
    this.studentDataSource = new MatTableDataSource(this.computedStudentData);
  }

  
  recalculateStudentData(refreshRow: number): void {
    console.log('refresh row: ', refreshRow);
    // first refresh the data
    this.computedStudentData = JSON.parse(JSON.stringify(this.studentData));
    console.log('summary row? ', this.computedStudentData[refreshRow].summaryRow);
    if (!this.computedStudentData[refreshRow].summaryRow) {
      console.log('inside method!');
      let numDataRows = this.studentData.length - 2;// the last two rows are the summary rows
      let ii: number = 0;
      let energyDiff: number = 0;
      this.computedStudentData.forEach((studentDatum: StudentDatum) => {
        if ((!studentDatum.summaryRow) && (ii !== refreshRow)) {
          if ((studentDatum.incoming === true) && (typeof studentDatum.energy === 'number')) {
            energyDiff += studentDatum.energy;
          } else if ((studentDatum.incoming === false) && (typeof studentDatum.energy === 'number')) {
            energyDiff -= studentDatum.energy;
          }
        };
        ii += 1;
      });
      let particleEnergy: number = this.computedStudentData[refreshRow].incoming ? (-1)*energyDiff : energyDiff;
      let pMag: number = Number.POSITIVE_INFINITY;
      let momentum = this.computedStudentData[refreshRow].pMag;
      if (typeof momentum === 'number') {
        pMag = momentum;
      }

      let particleMass: number = Math.sqrt(particleEnergy * particleEnergy - (pMag * pMag));

      this.computedStudentData[refreshRow].energy = particleEnergy;
      this.computedStudentData[refreshRow].mass = particleMass;
      let actualMass = this.studentData[refreshRow].mass;
      let deltaMass: number = Number.POSITIVE_INFINITY;
      let deltaMassPercent: number | string = Number.POSITIVE_INFINITY;
      if (typeof actualMass === 'number') {
        deltaMass = (particleMass - actualMass);
        if (actualMass > 0) {
          deltaMassPercent = (deltaMass/actualMass)*100;
        } else {
          deltaMassPercent = '-';
        }
      }
      
      this.computedStudentData[refreshRow].mass = particleMass;
      this.computedStudentData[numDataRows].mass = deltaMass;
      this.computedStudentData[numDataRows+1].mass = deltaMassPercent;
      
      this.computedStudentData[numDataRows].energy = '';//first of the two summary rows
      this.computedStudentData[numDataRows].canBeCalculated = true;
      this.computedStudentData[numDataRows].isBeingCalculated = true;
      this.computedStudentData[numDataRows].icon = 'calculate';
      this.computedStudentData[numDataRows+1].energy = null;//second of the two summary rows
      this.computedStudentData[numDataRows+1].canBeCalculated = false;
      this.computedStudentData[numDataRows+1].isBeingCalculated = true;

      this.computedStudentData[refreshRow].canBeCalculated = false;
      this.computedStudentData[refreshRow].isBeingCalculated = true;
      this.computedStudentData[refreshRow].icon = 'west';
      
    }
    this.studentDataSource = new MatTableDataSource(this.computedStudentData);

  }


}
