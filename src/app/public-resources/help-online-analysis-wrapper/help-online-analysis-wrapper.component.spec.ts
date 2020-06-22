import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpOnlineAnalysisWrapperComponent } from './help-online-analysis-wrapper.component';

describe('HelpOnlineAnalysisWrapperComponent', () => {
  let component: HelpOnlineAnalysisWrapperComponent;
  let fixture: ComponentFixture<HelpOnlineAnalysisWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpOnlineAnalysisWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOnlineAnalysisWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
