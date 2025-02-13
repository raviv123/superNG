import { TestBed } from '@angular/core/testing';

import { SuperNGService } from './super-ng.service';

describe('SuperNGService', () => {
  let service: SuperNGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperNGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
