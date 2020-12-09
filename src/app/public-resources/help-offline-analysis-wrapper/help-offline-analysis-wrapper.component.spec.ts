import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpOfflineAnalysisWrapperComponent } from './help-offline-analysis-wrapper.component';

describe('HelpOfflineAnalysisWrapperComponent', () => {
  let component: HelpOfflineAnalysisWrapperComponent;
  let fixture: ComponentFixture<HelpOfflineAnalysisWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpOfflineAnalysisWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOfflineAnalysisWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
