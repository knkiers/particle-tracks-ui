import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MomentumAxisComponent } from './momentum-axis.component';

describe('MomentumAxisComponent', () => {
  let component: MomentumAxisComponent;
  let fixture: ComponentFixture<MomentumAxisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentumAxisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentumAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
