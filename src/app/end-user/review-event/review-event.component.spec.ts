import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewEventComponent } from './review-event.component';

describe('ReviewEventComponent', () => {
  let component: ReviewEventComponent;
  let fixture: ComponentFixture<ReviewEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
