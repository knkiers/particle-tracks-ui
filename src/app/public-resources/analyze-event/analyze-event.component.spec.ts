import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalyzeEventComponent } from './analyze-event.component';

describe('AnalyzeEventComponent', () => {
  let component: AnalyzeEventComponent;
  let fixture: ComponentFixture<AnalyzeEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
