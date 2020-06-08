import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {UserService} from '../../shared/services/user.service';
import { EventAnalysisService } from '../../shared/services/event-analysis.service';

import { User } from '../../shared/models/user';

import * as moment from 'moment';


@Component({
  selector: 'app-user-events-by-id',
  templateUrl: './user-events-by-id.component.html',
  styleUrls: ['./user-events-by-id.component.scss']
})
export class UserEventsByIdComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private user: User = null;
  events: any = null;
  private analysisDisplayComponent: any;
  private eventEnergyMomentumComponent: any;

  displayedColumns: string[] = ['title', 'created', 'updated', 'submitted', 'actions'];

  userEvents: UserEvent[];
  dataSource: MatTableDataSource<any>;
  errorMessage: string = '';

  // https://stackoverflow.com/questions/52037445/moment-is-giving-me-error-in-angular-5-html-template
  moment: any = moment;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private eventAnalysisService: EventAnalysisService,
    //public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('user-events -- received route params!');
      let userId = +params['userId'];
      this.fetchUser(userId);
    });
  }

  fetchUser(userId: number) {
    this.userService.fetchUser(userId).subscribe(
      user => {
        console.log('got user data!');
        this.user = new User(user);
        console.log(this.user);
        this.fetchUserEvents(this.user.analyzedEvents);
      },
      error => {
        this.errorMessage = 'Sorry, there appears to have been a problem.  Your data could not be accessed.  Please try again later.  If the problem persists, please contact the site administrator.'
      }
      );
  }

  fetchUserEvents(eventIdList: number[]) {

    console.log('event id list: ', eventIdList);

    this.errorMessage = '';
    
    console.log('here are the events: ', eventIdList);
    this.eventAnalysisService.getAnalyzedUserEvents(eventIdList).subscribe(
      (userEvents: UserEvent[]) => {
        this.userEvents = userEvents;
        console.log('userEvents: ', this.userEvents);
        this.dataSource = new MatTableDataSource(this.userEvents);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.dataSource.renderRows();
        console.log('dataSource: ', this.dataSource);
      },
      error => {
        this.errorMessage = 'Sorry, there appears to have been a problem.  Your data could not be accessed.  Please try again later.  If the problem persists, please contact the site administrator.'
      }
    );
  }

  viewEvent(userEvent: UserEvent) {
    //https://codecraft.tv/courses/angular/routing/parameterised-routes/
    //this.router.navigate(['events', {id: userEvent.id}]);
  }
  
}

export interface UserEvent {
  title: string;
  id: number;
  created: string;
  updated: string;
  submitted: boolean;
  uuid: string;
}


