import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analysis-stepper',
  templateUrl: './analysis-stepper.component.html',
  styleUrls: ['./analysis-stepper.component.scss']
})
export class AnalysisStepperComponent implements OnInit {

  analysisOK: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onReviewStatusUpdate(analysisOK: boolean) {
    this.analysisOK = analysisOK;
  }
}
