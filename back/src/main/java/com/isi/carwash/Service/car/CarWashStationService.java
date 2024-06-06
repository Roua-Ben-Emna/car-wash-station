package com.isi.carwash.Service.car;

import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Repository.CarWashStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarWashStationService {

    @Autowired
    private CarWashStationRepository carWashStationRepository;

    public List<CarWashStation> getAllCarWashStations() {
        return carWashStationRepository.findAll();
    }

    public CarWashStation getCarWashStationById(Long id) {
        return carWashStationRepository.findById(id).orElseThrow(() -> new RuntimeException("Car Wash Station not found"));
    }

    public CarWashStation createCarWashStation(CarWashStation carWashStation) {
        return carWashStationRepository.save(carWashStation);
    }

    public CarWashStation updateCarWashStation(Long id, CarWashStation carWashStation) {
        CarWashStation existingCarWashStation = getCarWashStationById(id);
        existingCarWashStation.setName(carWashStation.getName());
        existingCarWashStation.setLatitude(carWashStation.getLatitude());
        existingCarWashStation.setLongitude(carWashStation.getLongitude());
        existingCarWashStation.setMaxCapacityCars(carWashStation.getMaxCapacityCars());
        existingCarWashStation.setCurrentCarsInWash(carWashStation.getCurrentCarsInWash());
        existingCarWashStation.setManager(carWashStation.getManager());
        return carWashStationRepository.save(existingCarWashStation);
    }

    public void deleteCarWashStation(Long id) {
        carWashStationRepository.deleteById(id);
    }
//    public List<CarWashStation> getCarWashStationByProximateLocation(double latitude, double longitude, double distanceInMeters) {
//        return carWashStationRepository.findByProximateLocation(latitude, longitude, distanceInMeters);
//    }
}
