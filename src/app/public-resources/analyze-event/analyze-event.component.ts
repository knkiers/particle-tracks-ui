import { Component, OnInit } from '@angular/core';

import { AnalysisDisplayComponent } from '../../end-user/analysis-display/analysis-display.component';
import { ReviewEventComponent } from '../../end-user/review-event/review-event.component';
@Component({
  selector: 'app-analyze-event',
  templateUrl: './analyze-event.component.html',
  styleUrls: ['./analyze-event.component.scss'],
  entryComponents: [AnalysisDisplayComponent, ReviewEventComponent]
})
export class AnalyzeEventComponent implements OnInit {

  showReviewCard: boolean = false;
  warningHasBeenSeen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onAnalysisStatusUpdate(event: any) {
    console.log('analysis status update');
  }

  onReviewStatusUpdate(event: any) {
    console.log('review status update!');
  }

  onShowReviewCard(showCard: boolean) {
    this.showReviewCard = showCard;
  }

  onWarningSeen() {
    this.warningHasBeenSeen = !this.warningHasBeenSeen;
  }

}
