import { Component, OnInit, Input } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { StudentDatum } from '../event-energy-momentum/event-energy-momentum.component';

@Component({
  selector: 'app-student-data-table',
  templateUrl: './student-data-table.component.html',
  styleUrls: ['./student-data-table.component.scss']
})
export class StudentDataTableComponent implements OnInit {

  @Input() studentData: StudentDatum[];

  displayedColumnsStudentData: string[] = ['particle', 'circleNumber', 'inOut', 'mass', 'radius', 'theta', 'momentum', 'px', 'py', 'energy'];

  studentDataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
    this.studentDataSource = new MatTableDataSource(this.studentData);
  }

}
