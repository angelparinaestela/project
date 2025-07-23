import { TestBed } from '@angular/core/testing';

import { Recarga } from './recarga';

describe('Recarga', () => {
  let service: Recarga;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recarga);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
