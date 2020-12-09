import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticleTooltipComponent } from './particle-tooltip.component';

describe('ParticleTooltipComponent', () => {
  let component: ParticleTooltipComponent;
  let fixture: ComponentFixture<ParticleTooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticleTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticleTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
