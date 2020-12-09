import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticlePropertiesComponent } from './particle-properties.component';

describe('ParticlePropertiesComponent', () => {
  let component: ParticlePropertiesComponent;
  let fixture: ComponentFixture<ParticlePropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticlePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticlePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
