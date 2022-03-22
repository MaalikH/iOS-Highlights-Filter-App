import { TestBed } from '@angular/core/testing';

import { BooksDataService } from './books-data.service';

describe('BooksDataService', () => {
  let service: BooksDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
