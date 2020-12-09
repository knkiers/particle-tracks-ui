import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticleDecaysComponent } from './particle-decays.component';

describe('ParticleDecaysComponent', () => {
  let component: ParticleDecaysComponent;
  let fixture: ComponentFixture<ParticleDecaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticleDecaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticleDecaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
