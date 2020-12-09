import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalysisDisplayWrapperComponent } from './analysis-display-wrapper.component';

describe('AnalysisDisplayWrapperComponent', () => {
  let component: AnalysisDisplayWrapperComponent;
  let fixture: ComponentFixture<AnalysisDisplayWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisDisplayWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisDisplayWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
