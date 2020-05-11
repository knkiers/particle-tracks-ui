import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleTableComponent } from './circle-table.component';

describe('CircleTableComponent', () => {
  let component: CircleTableComponent;
  let fixture: ComponentFixture<CircleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
