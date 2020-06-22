import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcwIconComponent } from './ccw-icon.component';

describe('CcwIconComponent', () => {
  let component: CcwIconComponent;
  let fixture: ComponentFixture<CcwIconComponent>;

  beforeEach(async(() => {
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
