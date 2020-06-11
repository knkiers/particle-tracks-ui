import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticleDecaysComponent } from './particle-decays.component';

describe('ParticleDecaysComponent', () => {
  let component: ParticleDecaysComponent;
  let fixture: ComponentFixture<ParticleDecaysComponent>;

  beforeEach(async(() => {
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
