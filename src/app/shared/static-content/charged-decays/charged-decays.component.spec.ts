import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChargedDecaysComponent } from './charged-decays.component';

describe('ChargedDecaysComponent', () => {
  let component: ChargedDecaysComponent;
  let fixture: ComponentFixture<ChargedDecaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargedDecaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargedDecaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
