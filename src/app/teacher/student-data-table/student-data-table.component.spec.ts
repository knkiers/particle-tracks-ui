import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentDataTableComponent } from './student-data-table.component';

describe('StudentDataTableComponent', () => {
  let component: StudentDataTableComponent;
  let fixture: ComponentFixture<StudentDataTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
