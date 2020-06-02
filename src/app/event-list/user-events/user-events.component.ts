import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EventAnalysisService } from '../../shared/services/event-analysis.service';

import * as moment from 'moment'; // add this 1 of 4


@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['title', 'created', 'updated', 'submitted', 'actions'];

  userEvents: UserEvent[];
  dataSource: MatTableDataSource<any>;
  errorMessage: string = '';

  // https://stackoverflow.com/questions/52037445/moment-is-giving-me-error-in-angular-5-html-template
  moment: any = moment;

  constructor(
    private router: Router,
    private eventAnalysisService: EventAnalysisService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAnalyzedEvents();
  }

  getAnalyzedEvents() {
    this.errorMessage = '';
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
        },
        error => {
          this.errorMessage = 'Sorry, there appears to have been a problem.  Your data could not be accessed.  Please try again later.  If the problem persists, please contact the site administrator.'
        }
      );
  }

  editEvent(userEvent: UserEvent) {
    //https://codecraft.tv/courses/angular/routing/parameterised-routes/
    this.router.navigate(['events', {id: userEvent.id}]);
  }
  
  openDialog(userEvent: UserEvent): void {
    console.log('inside dialog method: ', userEvent);
    const dialogRef = this.dialog.open(DeleteEventDialog, {
      width: '60%',
      data: {
        userEvent: userEvent,
        moment: this.moment
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      console.log('The dialog was closed', result, typeof result);
      if (result === 'delete') {
        this.eventAnalysisService.deleteAnalyzedEvents([userEvent.id])
        .subscribe(
          result => {
            this.getAnalyzedEvents();
          },
          error => {
            this.errorMessage = 'Sorry, there appears to have been a problem.  The event could not be deleted.  Please try again later.'
          });
      }
      //this.redirect();
    });
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

@Component({
  selector: 'delete-event-dialog',
  templateUrl: 'delete-event-dialog.html',
})
export class DeleteEventDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteEventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close('');
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }

}


