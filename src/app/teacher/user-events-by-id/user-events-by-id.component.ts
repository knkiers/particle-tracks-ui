import { Component, OnInit, ViewChild, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../shared/services/user.service';
import { EventAnalysisService } from '../../shared/services/event-analysis.service';

import { AnalysisDisplayWrapperComponent } from '../analysis-display-wrapper/analysis-display-wrapper.component';
import { UserEventWrapperAnchorDirective } from './user-event-wrapper-anchor.directive';
import { EventInfoAnchorDirective } from './event-info-anchor.directive';
import { EventEnergyMomentumComponent } from '../event-energy-momentum/event-energy-momentum.component';


import { User } from '../../shared/models/user';

import * as moment from 'moment';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'app-user-events-by-id',
  templateUrl: './user-events-by-id.component.html',
  styleUrls: ['./user-events-by-id.component.scss']
})
export class UserEventsByIdComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(UserEventWrapperAnchorDirective, { static: false }) userEventWrapperAnchor: UserEventWrapperAnchorDirective;
  @ViewChild(EventInfoAnchorDirective, { static: false }) eventInfoAnchor: EventInfoAnchorDirective;

  user: User = null;
  events: any = null;
  private analysisDisplayWrapperComponent: any;
  private eventEnergyMomentumComponent: any;

  subscription: Subscription;

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
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.subscription = eventAnalysisService.analysisDisplayClosed$.subscribe(
      event => {
        this.closeUserEvent();
      });
  }




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

  openUserEvent(eventData: any) {
    console.log(eventData);
    console.log('in user events by id; user event wrapper anchor: ', this.userEventWrapperAnchor);
    this.userEventWrapperAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AnalysisDisplayWrapperComponent);
    this.analysisDisplayWrapperComponent = this.userEventWrapperAnchor.viewContainer.createComponent(componentFactory).instance;
    this.analysisDisplayWrapperComponent.eventData = eventData;
    //this.analysisDisplayWrapperComponent.userIsReadOnly = true;

    this.eventInfoAnchor.viewContainer.clear();
    let eventInfoComponentFactory = this.componentFactoryResolver.resolveComponentFactory(EventEnergyMomentumComponent);
    this.eventEnergyMomentumComponent = this.eventInfoAnchor.viewContainer.createComponent(eventInfoComponentFactory).instance;
    this.eventEnergyMomentumComponent.eventData = eventData;
    //this.analysisDisplayComponent.userIsReadOnly = true;

  }

  closeUserEvent() {
    this.userEventWrapperAnchor.viewContainer.clear();
    this.eventInfoAnchor.viewContainer.clear();
  }





  viewEvent(userEvent: UserEvent) {
    //https://codecraft.tv/courses/angular/routing/parameterised-routes/
    //this.router.navigate(['events', {id: userEvent.id}]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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


