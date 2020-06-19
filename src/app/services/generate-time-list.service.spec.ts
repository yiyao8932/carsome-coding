import { TestBed } from '@angular/core/testing';

import { GenerateTimeListService } from './generate-time-list.service';

describe('GenerateTimeListService', () => {
  let service: GenerateTimeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateTimeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
