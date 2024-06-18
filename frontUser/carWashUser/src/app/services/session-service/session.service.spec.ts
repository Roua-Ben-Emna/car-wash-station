import { TestBed } from '@angular/core/testing';

import { CarWashSessionService } from './session.service';

describe('SessionService', () => {
  let service: CarWashSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarWashSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
