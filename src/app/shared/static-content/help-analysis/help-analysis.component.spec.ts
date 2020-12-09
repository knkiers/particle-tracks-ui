import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpOnlineAnalysisComponent } from './help-analysis.component';

describe('HelpOnlineAnalysisComponent', () => {
  let component: HelpOnlineAnalysisComponent;
  let fixture: ComponentFixture<HelpOnlineAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpOnlineAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOnlineAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
