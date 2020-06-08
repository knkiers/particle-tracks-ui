import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../shared/services/user.service';
import { EventAnalysisService } from '../../shared/services/event-analysis.service';

import { UserNumberEvents } from '../../shared/interfaces/user-number-events';

import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'username', 'numberEvents', 'latestActivity', 'actions'];

  dataSource: MatTableDataSource<any>;

  // https://stackoverflow.com/questions/52037445/moment-is-giving-me-error-in-angular-5-html-template
  moment: any = moment;

  //institutions: any = null;
  //haveInstitutions: boolean = false;
  users: UserNumberEvents[] = []; //TODO: create a User object....
  errorMessage: string = '';
  institutionName: string = 'this Institution';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    //this.fetchInstitutions();
    this.userService.fetchUsersThisInstitution().subscribe(
      response => {
        //console.log(users);
        //console.log(typeof users);//string
        //console.log(typeof this.users);//object
        this.users = response.users;
        this.institutionName = response.institution;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.dataSource.renderRows();
        console.log('dataSource: ', this.dataSource);
      },
      error => {
        this.errorMessage = 'Sorry, there appears to have been a problem.  Your data could not be accessed.  Please try again later.  If the problem persists, please contact the site administrator.'
      }
    )
  }

  /*
  fetchInstitutions() {
    this.userService.fetchInstitutions().subscribe(
      institutions => {
        console.log('institutions: ', institutions);
        this.institutions = institutions;
        this.haveInstitutions = true;
      },
      err => console.log("ERROR", err)
    );

  }

  getInstitutionName(id: number) {
    let institutionName = null;
    for (let institution of this.institutions) {
      if (institution.id === id) {
        institutionName = institution.name;
      }
    }
    return institutionName;
  }
  */

  /*
  fetchEvent(id: number) {
    console.log('event id: ', id, typeof id);
    this.eventAnalysisService.getAnalyzedEvent(id).subscribe(
      result => {
        console.log(result);
      }
    )
  }
  */

  // https://material.angular.io/components/table/overview
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewUserEventList(element: any) {
    console.log('click result: ', element);
  }


}
