package com.isi.carwash.Controller;

import com.isi.carwash.Entity.Car;
import com.isi.carwash.Entity.CarWashSession;
import com.isi.carwash.Entity.User;
import com.isi.carwash.Repository.UserRepository;
import com.isi.carwash.Service.car.CarService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/car")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Car>> getAllCarsByUser(@PathVariable Long userId) {
        List<Car> cars = carService.getAllCarsByUser(userId);
        return new ResponseEntity<>(cars, HttpStatus.OK);
    }

    @PostMapping
    public Car createCar(@RequestBody Car car) {
            Optional<User> userOptional = userRepository.findById(car.getUser().getId());
            if (userOptional.isPresent()) {
                car.setUser(userOptional.get());
                return carService.createCar(car);
            } else {
                throw new EntityNotFoundException("probleme");
            }
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        if (car != null) {
            return new ResponseEntity<>(car, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }


    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car updatedCar) {
        return carService.updateCar(id, updatedCar);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }

    @GetMapping("/station/{stationId}")
    public List<Car> getAllCarsByStation(@PathVariable Long stationId) {
        return carService.getAllCarsByStation(stationId);
    }
}
