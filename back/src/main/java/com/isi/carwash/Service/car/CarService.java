package com.isi.carwash.Service.car;

import com.isi.carwash.Entity.Car;
import com.isi.carwash.Entity.Car;
import com.isi.carwash.Entity.User;
import com.isi.carwash.Repository.CarRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> getAllCarsByStation(Long stationId) {
        return carRepository.findAllByStationId(stationId);
    }
    public  Car createCar(Car car){
        return carRepository.save(car);
    }
    public Car getCarById(Long id){
        Optional<Car> carOptional = carRepository.findById(id);
        if(carOptional.isPresent()){
            Car car = carOptional.get();
            return  carRepository.save(car);
        }else {
            throw new EntityNotFoundException("Car not found !");
        }
    }

    public Car updateCar(Long id, Car updatedcar){
        Optional<Car> optionalCar = carRepository.findById(id);
        if(optionalCar.isPresent()) {
            Car car = optionalCar.get();
            car.setMake(updatedcar.getMake());
            car.setModel(updatedcar.getModel());
            car.setYear(updatedcar.getYear());
            car.setSize(updatedcar.getSize());
            car.setUser(car.getUser());
            return carRepository.save(car);
        } else {
            return null;
        }

    }
    public void  deleteCar(Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("voiture non trouvé"));
        carRepository.delete(car);
    }

}
