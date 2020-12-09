import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventEnergyMomentumComponent } from './event-energy-momentum.component';

describe('EventEnergyMomentumComponent', () => {
  let component: EventEnergyMomentumComponent;
  let fixture: ComponentFixture<EventEnergyMomentumComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventEnergyMomentumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEnergyMomentumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
