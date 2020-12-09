import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TechnicalBackgroundComponent } from './technical-background.component';

describe('TechnicalBackgroundComponent', () => {
  let component: TechnicalBackgroundComponent;
  let fixture: ComponentFixture<TechnicalBackgroundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
