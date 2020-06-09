import { Component, OnInit, AfterViewInit, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { UserEventAnchorDirective } from './user-event-anchor.directive';
import { AnalysisDisplayComponent } from '../../end-user/analysis-display/analysis-display.component';

@Component({
  selector: 'app-analysis-display-wrapper',
  templateUrl: './analysis-display-wrapper.component.html',
  styleUrls: ['./analysis-display-wrapper.component.scss']
})
export class AnalysisDisplayWrapperComponent implements OnInit, AfterViewInit {

  //@Input() eventData: any = null;
  @ViewChild(UserEventAnchorDirective, { static: false }) userEventAnchor: UserEventAnchorDirective;

  eventData: any = null;
  private analysisDisplayComponent: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    console.log('in constructor; eventData: ', this.eventData);
    console.log('inside constructor; user event anchor: ', this.userEventAnchor);
  }

  ngOnInit(): void {
    console.log('in wrapper oninit; eventData: ', this.eventData);
    console.log('inside oninit; user event anchor: ', this.userEventAnchor);
  }

  ngAfterViewInit() {
    console.log('inside after view init; user event anchor: ', this.userEventAnchor);
    console.log('in after view init; eventData: ', this.eventData);
    // https://blog.angular-university.io/angular-debugging/
    // if don't wrap the following in the setTimeout(), get an ExpressionChangedAfterItHasBeenCheckedError;
    // this is probably not the ideal way to solve this problem, but don't know of another way at the moment....
    setTimeout(() => {
      this.userEventAnchor.viewContainer.clear();
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AnalysisDisplayComponent);
      this.analysisDisplayComponent = this.userEventAnchor.viewContainer.createComponent(componentFactory).instance;
      this.analysisDisplayComponent.refreshView(this.eventData, false);
      this.analysisDisplayComponent.userIsReadOnly = true;
    }, 0);
  }

  onClick() {
    console.log('user event anchor: ', this.userEventAnchor);
  }

}
