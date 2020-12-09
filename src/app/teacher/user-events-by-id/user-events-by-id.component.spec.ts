import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserEventsByIdComponent } from './user-events-by-id.component';

describe('UserEventsByIdComponent', () => {
  let component: UserEventsByIdComponent;
  let fixture: ComponentFixture<UserEventsByIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEventsByIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEventsByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
