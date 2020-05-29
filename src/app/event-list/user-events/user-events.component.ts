import { Component, OnInit, ViewChild } from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { EventAnalysisService } from '../../shared/services/event-analysis.service';

import * as moment from 'moment'; // add this 1 of 4


@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['title','created','submitted','actions'];

  userEvents: UserEvent[];
  dataSource: MatTableDataSource<any>;

  // https://stackoverflow.com/questions/52037445/moment-is-giving-me-error-in-angular-5-html-template
  moment: any = moment;

  constructor(
    private eventAnalysisService: EventAnalysisService
  ) { }

  ngOnInit(): void {
    this.eventAnalysisService.getAnalyzedEvents()
      .subscribe(
        (userEvents: UserEvent[]) => {
          this.userEvents = userEvents;
          console.log('userEvents: ', this.userEvents);
          this.dataSource = new MatTableDataSource(this.userEvents);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          //this.dataSource.renderRows();
          console.log('dataSource: ', this.dataSource);
        }
      );
  }



}

export interface UserEvent {
  title: string;
  id: number;
  created: string;
  submitted: boolean;
  uuid: string;
}

