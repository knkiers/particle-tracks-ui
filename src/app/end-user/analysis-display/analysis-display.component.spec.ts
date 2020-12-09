import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalysisDisplayComponent } from './analysis-display.component';

describe('AnalysisDisplayComponent', () => {
  let component: AnalysisDisplayComponent;
  let fixture: ComponentFixture<AnalysisDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
