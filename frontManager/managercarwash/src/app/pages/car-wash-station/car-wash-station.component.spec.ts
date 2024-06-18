import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarWashStationComponent } from './car-wash-station.component';

describe('CarWashStationComponent', () => {
  let component: CarWashStationComponent;
  let fixture: ComponentFixture<CarWashStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarWashStationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarWashStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
