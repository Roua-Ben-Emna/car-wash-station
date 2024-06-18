package com.isi.carwash.Service.car;

import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Repository.CarWashStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarWashStationService {

    @Autowired
    private CarWashStationRepository carWashStationRepository;

    private static final double DEFAULT_DISTANCE = 5000; // 5 km
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
        existingCarWashStation.setLocation(carWashStation.getLocation());
        existingCarWashStation.setEstimateCarSmall(carWashStation.getEstimateCarSmall());
        existingCarWashStation.setEstimateCarMedium(carWashStation.getEstimateCarMedium());
        existingCarWashStation.setEstimateCarLarge(carWashStation.getEstimateCarLarge());
        existingCarWashStation.setEstimateTypeExterior(carWashStation.getEstimateTypeExterior());
        existingCarWashStation.setEstimateTypeInterior(carWashStation.getEstimateTypeInterior());
        existingCarWashStation.setEstimateTypeExteriorInterior(carWashStation.getEstimateTypeExteriorInterior());
        return carWashStationRepository.save(existingCarWashStation);
    }
    public List<CarWashStation> searchCarWashStationsByName(String name) {
        return carWashStationRepository.findByNameContainingIgnoreCase(name);
    }
    public void deleteCarWashStation(Long id) {
        carWashStationRepository.deleteById(id);
    }

    public List<CarWashStation> getCarWashStationsByProximateLocation(double latitude, double longitude) {
        List<CarWashStation> allStations = carWashStationRepository.findAll();
        return allStations.stream()
                .filter(station -> calculateDistance(latitude, longitude, station.getLatitude(), station.getLongitude()) <= DEFAULT_DISTANCE)
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters
        return distance;
    }

}
