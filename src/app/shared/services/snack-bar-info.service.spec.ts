import { TestBed } from '@angular/core/testing';

import { SnackBarInfoService } from './snack-bar-info.service';

describe('SnackBarInfoService', () => {
  let service: SnackBarInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackBarInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
