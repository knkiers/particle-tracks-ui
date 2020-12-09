import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CircleItemComponent } from './circle-item.component';

describe('CircleItemComponent', () => {
  let component: CircleItemComponent;
  let fixture: ComponentFixture<CircleItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
