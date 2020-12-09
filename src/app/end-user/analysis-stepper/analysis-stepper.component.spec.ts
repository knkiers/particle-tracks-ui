import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalysisStepperComponent } from './analysis-stepper.component';

describe('AnalysisStepperComponent', () => {
  let component: AnalysisStepperComponent;
  let fixture: ComponentFixture<AnalysisStepperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
