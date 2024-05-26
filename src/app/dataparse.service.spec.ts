import { TestBed } from '@angular/core/testing';

import { DataparseService } from './dataparse.service';

describe('DataparseService', () => {
  let service: DataparseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataparseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
