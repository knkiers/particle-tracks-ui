import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisDisplayWrapperComponent } from './analysis-display-wrapper.component';

describe('AnalysisDisplayWrapperComponent', () => {
  let component: AnalysisDisplayWrapperComponent;
  let fixture: ComponentFixture<AnalysisDisplayWrapperComponent>;

  beforeEach(async(() => {
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
