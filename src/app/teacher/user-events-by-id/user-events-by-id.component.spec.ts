import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsByIdComponent } from './user-events-by-id.component';

describe('UserEventsByIdComponent', () => {
  let component: UserEventsByIdComponent;
  let fixture: ComponentFixture<UserEventsByIdComponent>;

  beforeEach(async(() => {
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
