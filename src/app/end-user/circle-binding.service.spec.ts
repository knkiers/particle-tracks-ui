import { TestBed } from '@angular/core/testing';

import { CircleBindingService } from './circle-binding.service';

describe('CircleBindingService', () => {
  let service: CircleBindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircleBindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
