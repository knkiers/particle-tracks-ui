import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CcwIconComponent } from './ccw-icon.component';

describe('CcwIconComponent', () => {
  let component: CcwIconComponent;
  let fixture: ComponentFixture<CcwIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CcwIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcwIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
