import { TestBed } from '@angular/core/testing';
import { CarWashStationService } from './station.service';



describe('StationService', () => {
  let service: CarWashStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarWashStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
