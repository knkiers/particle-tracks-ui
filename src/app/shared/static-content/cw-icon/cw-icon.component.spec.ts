import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CwIconComponent } from './cw-icon.component';

describe('CwIconComponent', () => {
  let component: CwIconComponent;
  let fixture: ComponentFixture<CwIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
