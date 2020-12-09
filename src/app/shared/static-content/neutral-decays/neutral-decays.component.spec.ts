import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NeutralDecaysComponent } from './neutral-decays.component';

describe('NeutralDecaysComponent', () => {
  let component: NeutralDecaysComponent;
  let fixture: ComponentFixture<NeutralDecaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NeutralDecaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeutralDecaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
