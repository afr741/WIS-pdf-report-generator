import { TestBed } from '@angular/core/testing';

import { PdfparseService } from './pdfparse.service';

describe('PdfparseService', () => {
  let service: PdfparseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfparseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
